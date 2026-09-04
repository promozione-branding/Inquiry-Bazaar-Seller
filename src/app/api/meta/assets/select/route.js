import { NextResponse } from "next/server";
import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import { metaGet, metaPost, } from "@/utils/meta/graph";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        const sellerId = getSellerIdFromRequest(request);
        const body = await request.json();
        const pageId = body.pageId;

        if (!pageId) {
            return NextResponse.json(
                { success: false, message: "pageId is required", },
                { status: 400, }
            );
        }

        await connectDB();

        const integration = await Integration.findOne({
            userId: sellerId,
            provider: "meta",
            status: "connected",
        });

        if (!integration) {
            return NextResponse.json(
                { success: false, message: "Meta is not connected", },
                { status: 404, }
            );
        }

        const userAccessToken = integration.credentials?.accessToken;
        if (!userAccessToken) {
            throw new Error("Meta user access token missing");
        }

        const pages = await metaGet("/me/accounts",
            { fields: "id,name,access_token,tasks", limit: 100, },
            userAccessToken
        );

        const page = (pages.data || []).find((item) => String(item.id) === String(pageId));
        if (!page) {
            return NextResponse.json(
                { success: false, message: "Selected Facebook Page was not found", },
                { status: 404, }
            );
        }

        const pageAccessToken = page.access_token;
        if (!pageAccessToken) {
            throw new Error("Page access token not received");
        }

        const subscription = await metaPost(`/${pageId}/subscribed_apps`,
            { subscribed_fields: "leadgen", },
            pageAccessToken
        );

        console.log(
            "Meta leadgen subscription:",
            subscription
        );

        // ------------------------------------------------
        // 3. Save selected page
        // ------------------------------------------------

        integration.credentials.accessToken =
            pageAccessToken;

        integration.metadata = {
            ...(integration.metadata || {}),

            pageId: page.id,
            pageName: page.name,

            leadgenSubscribed: true,

            selectedAt: new Date(),
        };

        integration.status =
            "connected";

        integration.connectedAt =
            integration.connectedAt ||
            new Date();

        integration.errorMessage =
            null;

        await integration.save();

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
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}