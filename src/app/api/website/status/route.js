import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import Integration from "@/models/IntegrationSchema";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        await connectDB();

        const userId =
            await getSellerIdFromRequest(request);

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
            await Integration.findOne({
                userId,
                provider: "website",
            }).lean();

        return NextResponse.json({
            success: true,
            integration,
        });
    } catch (error) {
        console.error(
            "Website status error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to get website status",
            },
            {
                status: 500,
            }
        );
    }
}
