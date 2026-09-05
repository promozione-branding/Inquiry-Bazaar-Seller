import { NextResponse } from "next/server";
import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import { metaGet, metaPost } from "@/utils/meta/graph";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const sellerId = getSellerIdFromRequest(request);

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
        // 1. Find Meta integration
        // ------------------------------------------------

        const integration = await Integration.findOne({
            // IMPORTANT:
            // If getSellerIdFromRequest returns companyId,
            // use companyId here.
            companyId: sellerId,

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
        // 2. Get Meta USER access token
        // ------------------------------------------------

        const userAccessToken =
            integration.credentials?.accessToken;

        if (!userAccessToken) {
            throw new Error(
                "Meta user access token missing"
            );
        }

        // ------------------------------------------------
        // 3. Get Facebook Pages
        // ------------------------------------------------

        const pages = await metaGet(
            "/me/accounts",
            {
                fields: "id,name,access_token,tasks",
                limit: 100,
            },
            userAccessToken
        );

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
        // 4. Get PAGE access token
        // ------------------------------------------------

        const pageAccessToken =
            page.access_token;

        if (!pageAccessToken) {
            throw new Error(
                "Page access token not received"
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
        // 5. Subscribe Page to leadgen webhook
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
        // 6. Save selected Page
        // ------------------------------------------------

        integration.companyId = sellerId;

        integration.provider = "meta";

        /*
         * IMPORTANT:
         *
         * Keep credentials.accessToken as the
         * META USER ACCESS TOKEN.
         *
         * Do NOT replace it with pageAccessToken.
         */
        integration.credentials.accessToken =
            userAccessToken;

        integration.metadata = {
            ...(integration.metadata || {}),

            pageId: String(page.id),

            pageName: page.name,

            // THIS IS THE IMPORTANT FIX
            pageAccessToken: pageAccessToken,

            leadgenSubscribed: true,

            selectedAt: new Date(),

            oauthConnected: true,
        };

        integration.status = "connected";

        integration.connectedAt =
            integration.connectedAt ||
            new Date();

        integration.errorMessage = null;

        await integration.save();

        // ------------------------------------------------
        // 7. Response
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