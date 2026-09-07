import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import Integration from "@/models/IntegrationSchema";

export const runtime = "nodejs";

export async function POST(request) {
    try {
        await connectDB();

        const userId = await getSellerIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const integration =
            await Integration.findOneAndUpdate(
                {
                    userId,
                    provider: "website",
                },
                {
                    $set: {
                        status: "disconnected",
                        errorMessage: null,
                    },
                },
                {
                    new: true,
                }
            );

        if (!integration) {
            return NextResponse.json({
                success: true,
                message: "Website integration was already disconnected",
            });
        }

        console.log(
            "🔌 Website integration disconnected:",
            String(userId)
        );

        return NextResponse.json({
            success: true,
            message: "Website disconnected successfully",
        });
    } catch (error) {
        console.error(
            "❌ Website disconnect error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to disconnect website",
            },
            {
                status: 500,
            }
        );
    }
}