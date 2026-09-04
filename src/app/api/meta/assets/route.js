import { NextResponse } from "next/server";
import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import { metaGet } from "@/utils/meta/graph";

export const runtime = "nodejs";
export async function GET(request) {
    try {
        const sellerId = getSellerIdFromRequest(request);
        await connectDB();

        const integration = await Integration.findOne({
            userId: sellerId,
            provider: "meta",
            status: "connected",
        }).lean();

        if (!integration) {
            return NextResponse.json(
                { success: false, message: "Meta is not connected", },
                { status: 404, }
            );
        }

        const accessToken = integration.credentials?.accessToken;
        if (!accessToken) {
            return NextResponse.json(
                { success: false, message: "Meta access token not found", },
                { status: 400, }
            );
        }

        const data = await metaGet("/me/accounts",
            { fields: "id,name,access_token,tasks", limit: 100, },
            accessToken
        );

        const pages = (data.data || []).map(
            (page) => ({
                id: page.id,
                name: page.name,

                // DO NOT send access token
                // to frontend.
                tasks: page.tasks || [],
            })
        );

        return NextResponse.json({ success: true, pages, });
    } catch (error) {
        console.error("Meta assets error:", error);
        return NextResponse.json(
            { success: false, message: error.message, },
            { status: 500, }
        );
    }
}