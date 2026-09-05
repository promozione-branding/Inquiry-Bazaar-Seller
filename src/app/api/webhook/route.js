import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import AdditionalInfo from "@/models/AdditionalInfo";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
import {
    getBearerToken,
    hashWebhookApiKey,
    verifyWebhookApiKey,
} from "@/utils/webhook";
import Leads from "@/models/Leads";

export async function GET(request) {
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

        let additionalInfo = await AdditionalInfo.findOne({ userId }).lean();

        if (!additionalInfo) {
            additionalInfo = await AdditionalInfo.create({
                userId,
            });

            additionalInfo =
                additionalInfo.toObject();
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        const webhookUrl = `${baseUrl}/api/webhook`;

        return NextResponse.json({
            success: true,
            webhook: {
                url: webhookUrl,

                apiKeyPrefix:
                    additionalInfo.webhookApiKeyPrefix || "",

                status:
                    additionalInfo.webhookApiStatus ||
                    "inactive",

                lastUsedAt:
                    additionalInfo.webhookLastUsedAt || null,
            },
        });
    } catch (error) {
        console.error(
            "GET WEBHOOK ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to load webhook settings",
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        // -----------------------------------------
        // 1. Get API key
        // -----------------------------------------

        const apiKey =
            getBearerToken(request);

        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Missing Authorization header",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 2. Hash incoming API key
        // -----------------------------------------

        const apiKeyHash =
            hashWebhookApiKey(apiKey);

        // -----------------------------------------
        // 3. Find matching webhook
        // -----------------------------------------

        const additionalInfo =
            await AdditionalInfo.findOne({
                webhookApiKeyHash: apiKeyHash,
            });

        if (!additionalInfo) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid API key",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 4. Check status
        // -----------------------------------------

        if (
            additionalInfo.webhookApiStatus !==
            "active"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Webhook is inactive",
                },
                { status: 403 }
            );
        }

        // -----------------------------------------
        // 5. Verify key
        // -----------------------------------------

        const valid =
            verifyWebhookApiKey(
                apiKey,
                additionalInfo.webhookApiKeyHash
            );

        if (!valid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid API key",
                },
                { status: 401 }
            );
        }

        // -----------------------------------------
        // 6. Read request body
        // -----------------------------------------

        let body;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid JSON body",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 7. Validate payload
        // -----------------------------------------

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body",
                },
                { status: 400 }
            );
        }

        // -----------------------------------------
        // 8. Update last used
        // -----------------------------------------

        additionalInfo.webhookLastUsedAt =
            new Date();

        await additionalInfo.save();

        // -----------------------------------------
        // 9. Process lead
        // ----------------------------------------

        // Required field
        if (!body.name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lead name is required",
                },
                { status: 400 }
            );
        }

        const lead = await Leads.create({
            userId: additionalInfo.userId,
            source: "website",
            name: body.name,
            phone: body.phone,
            email: body.email,
            companyName: body.companyName,
            gstNumber: body.gstNumber,
            place: body.place,
            product: body.product,
            message: body.message,
            priceRange: body.priceRange,
            dealValue: body.dealValue || 0,
            expectedClosureDate: body.expectedClosureDate || undefined,
            stage: body.stage || "new",
            status: body.status || "open",
            campaignId: body.campaignId,
            campaignName: body.campaignName,
        });

        console.log("WEBHOOK LEAD:", {
            userId: additionalInfo.userId.toString(),
            body, lead
        }
        );

        // -----------------------------------------
        // 10. Success
        // -----------------------------------------

        return NextResponse.json(
            {
                success: true,
                message: "Lead received successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "WEBHOOK ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Webhook processing failed",
            },
            { status: 500 }
        );
    }
}
