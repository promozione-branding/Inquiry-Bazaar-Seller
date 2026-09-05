import { NextResponse } from "next/server";

import { connectDB } from "@/config/db";
import AdditionalInfo from "@/models/AdditionalInfo";

// Replace with your actual auth helper
import { getSellerIdFromRequest } from "@/utils/meta/auth";

export async function PATCH(request) {
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

        const body = await request.json();

        const { status } = body;

        if (
            !["active", "inactive"].includes(
                status
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Status must be active or inactive",
                },
                { status: 400 }
            );
        }

        const additionalInfo =
            await AdditionalInfo.findOneAndUpdate(
                { userId },
                {
                    $set: {
                        webhookApiStatus: status,
                    },
                },
                {
                    new: true,
                    upsert: true,
                }
            );

        return NextResponse.json({
            success: true,

            status:
                additionalInfo.webhookApiStatus,
        });
    } catch (error) {
        console.error(
            "WEBHOOK STATUS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update webhook status",
            },
            { status: 500 }
        );
    }
}