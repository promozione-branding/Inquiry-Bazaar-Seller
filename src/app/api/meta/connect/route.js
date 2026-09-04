import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSellerIdFromRequest } from "@/utils/meta/auth";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const sellerId = getSellerIdFromRequest(request);

        const appId = process.env.META_APP_ID;
        const configId = process.env.META_CONFIG_ID;
        const redirectUri = process.env.META_REDIRECT_URI;

        if (!appId || !configId || !redirectUri) {
            throw new Error("Meta configuration is missing");
        }

        const state = jwt.sign(
            { userId: String(sellerId) },
            process.env.META_OAUTH_STATE_SECRET,
            { expiresIn: "10m" }
        );

        const params = new URLSearchParams({
            client_id: appId,
            redirect_uri: redirectUri,
            config_id: configId,
            response_type: "code",
            state,
        });

        const metaUrl =
            `https://www.facebook.com/v23.0/dialog/oauth?${params.toString()}`;

        console.log("META CONNECT", {
            redirectUri,
            configId,
            metaUrl,
        });

        return NextResponse.redirect(metaUrl);
    } catch (error) {
        console.error("Meta connect error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 401 }
        );
    }
}