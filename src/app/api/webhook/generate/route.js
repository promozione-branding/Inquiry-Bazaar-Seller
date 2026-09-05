import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import AdditionalInfo from "@/models/AdditionalInfo";

import {
    generateWebhookApiKey,
    hashWebhookApiKey,
    getWebhookApiKeyPrefix,
} from "@/utils/webhook";

// Replace with your actual auth helper
import { getSellerIdFromRequest } from "@/utils/meta/auth";

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

        // Generate new key
        const apiKey = generateWebhookApiKey();

        // Store ONLY hash
        const apiKeyHash =
            hashWebhookApiKey(apiKey);

        const apiKeyPrefix = getWebhookApiKeyPrefix(apiKey);

        await AdditionalInfo.findOneAndUpdate(
            { userId },
            {
                $set: {
                    webhookApiKeyHash: apiKeyHash,
                    webhookApiKeyPrefix: apiKeyPrefix,
                    webhookApiStatus: "active",
                },
            },
            {
                new: true,
                upsert: true,
            }
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const webhookUrl = `${baseUrl}/api/webhook`;

        return NextResponse.json({
            success: true,

            // IMPORTANT:
            // This is the ONLY time the full key
            // is returned.
            apiKey,

            apiKeyPrefix,

            webhookUrl,

            status: "active",

            message:
                "API key generated. Save it now because it will not be shown again.",
        });
    } catch (error) {
        console.error(
            "GENERATE WEBHOOK KEY ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to generate API key",
            },
            { status: 500 }
        );
    }
}