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
                { status: 401 }
            );
        }

        const integration =
            await Integration.findOneAndUpdate(
                { userId, provider: "website", },
                { $set: { status: "connected", connectedAt: new Date(), errorMessage: null, }, },
                { new: true, upsert: true, setDefaultsOnInsert: true, }
            );

        return NextResponse.json({
            success: true,
            message:
                "BrandBnalo website connected successfully",
            integration,
        });
    } catch (error) {
        console.error(
            "Website connect error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to connect website",
            },
            { status: 500 }
        );
    }
}