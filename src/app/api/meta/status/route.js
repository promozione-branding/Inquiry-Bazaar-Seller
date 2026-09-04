import { NextResponse } from "next/server";

import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const sellerId =
            getSellerIdFromRequest(request);

        await connectDB();

        const integration =
            await Integration.findOne({
                userId: sellerId,
                provider: "meta",
            }).lean();

        if (!integration) {
            return NextResponse.json({
                success: true,
                connected: false,
                integration: null,
            });
        }

        return NextResponse.json({
            success: true,

            connected:
                integration.status ===
                "connected",

            integration: {
                _id: integration._id,
                provider:
                    integration.provider,

                status:
                    integration.status,

                metadata:
                    integration.metadata,

                connectedAt:
                    integration.connectedAt,

                lastSyncAt:
                    integration.lastSyncAt,

                errorMessage:
                    integration.errorMessage,
            },
        });

    } catch (error) {
        console.error(
            "Meta status error:",
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