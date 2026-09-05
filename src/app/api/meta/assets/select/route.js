
import { NextResponse } from "next/server";
import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import { metaGet, metaPost } from "@/utils/meta/graph";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        // ------------------------------------------------
        // 1. Get logged-in seller/user ID
        // ------------------------------------------------

        const sellerId = getSellerIdFromRequest(request);

        if (!sellerId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // ------------------------------------------------
        // 2. Get selected Facebook Page ID
        // ------------------------------------------------

        const body = await request.json();

        const pageId = body.pageId;

        if (!pageId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "pageId is required",
                },
                { status: 400 }
            );
        }

        await connectDB();

        // ------------------------------------------------
        // 3. Find Meta integration for this user
        // ------------------------------------------------

        const integration = await Integration.findOne({
            userId: sellerId,
            provider: "meta",
        });

        if (!integration) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Meta is not connected",
                },
                { status: 404 }
            );
        }

        // ------------------------------------------------
        // 4. Get META USER access token
        // ------------------------------------------------

        const userAccessToken =
            integration.credentials?.accessToken;

        if (!userAccessToken) {
            throw new Error(
                "Meta user access token missing"
            );
        }

        // ------------------------------------------------
        // 5. Get Facebook Pages
        // ------------------------------------------------

        const pages = await metaGet(
            "/me/accounts",
            {
                fields: "id,name,access_token,tasks",
                limit: 100,
            },
            userAccessToken
        );

        console.log(
            "Facebook pages:",
            pages?.data?.map((page) => ({
                id: page.id,
                name: page.name,
                hasAccessToken: !!page.access_token,
            }))
        );

        // ------------------------------------------------
        // 6. Find selected Page
        // ------------------------------------------------

        const page = (pages.data || []).find(
            (item) =>
                String(item.id) === String(pageId)
        );

        if (!page) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Selected Facebook Page was not found",
                },
                { status: 404 }
            );
        }

        // ------------------------------------------------
        // 7. Get PAGE access token
        // ------------------------------------------------

        const pageAccessToken =
            page.access_token;

        if (!pageAccessToken) {
            throw new Error(
                "Facebook Page access token not received"
            );
        }

        console.log(
            "Selected Facebook Page:",
            {
                id: page.id,
                name: page.name,
                hasPageAccessToken:
                    !!pageAccessToken,
            }
        );

        // ------------------------------------------------
        // 8. Subscribe Page to leadgen webhook
        // ------------------------------------------------

        const subscription = await metaPost(
            `/${page.id}/subscribed_apps`,
            {
                subscribed_fields: "leadgen",
            },
            pageAccessToken
        );

        console.log(
            "Meta leadgen subscription:",
            subscription
        );

        // ------------------------------------------------
        // 9. Save selected Page
        // ------------------------------------------------

        /*
         * VERY IMPORTANT
         *
         * credentials.accessToken
         * = META USER ACCESS TOKEN
         *
         * metadata.pageAccessToken
         * = FACEBOOK PAGE ACCESS TOKEN
         */

        integration.credentials.accessToken =
            userAccessToken;

        integration.metadata = {
            ...(integration.metadata || {}),

            pageId: String(page.id),

            pageName: page.name,

            pageAccessToken: pageAccessToken,

            leadgenSubscribed: true,

            oauthConnected: true,

            selectedAt: new Date(),
        };

        integration.status = "connected";

        integration.connectedAt =
            integration.connectedAt ||
            new Date();

        integration.errorMessage = null;

        await integration.save();

        console.log(
            "Meta integration updated:",
            {
                userId: integration.userId,
                pageId: integration.metadata.pageId,
                pageName: integration.metadata.pageName,
                hasPageAccessToken:
                    !!integration.metadata.pageAccessToken,
                leadgenSubscribed:
                    integration.metadata.leadgenSubscribed,
            }
        );

        // ------------------------------------------------
        // 10. Return success
        // ------------------------------------------------

        return NextResponse.json({
            success: true,

            message:
                "Facebook Page connected successfully",

            page: {
                id: page.id,
                name: page.name,
            },

            leadgenSubscribed: true,
        });

    } catch (error) {
        console.error(
            "Meta select page error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error.message ||
                    "Failed to connect Facebook Page",
            },
            {
                status: 500,
            }
        );
    }
}