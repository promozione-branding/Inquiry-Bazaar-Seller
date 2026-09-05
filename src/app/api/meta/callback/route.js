import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Integration from "@/models/IntegrationSchema";
import { connectDB } from "@/config/db";

export const runtime = "nodejs";

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const code =
            searchParams.get("code");

        const state =
            searchParams.get("state");

        const error =
            searchParams.get("error");

        const errorDescription =
            searchParams.get("error_description");

        console.log("META CALLBACK:", {
            hasCode: !!code,
            hasState: !!state,
            error,
            errorDescription,
        });

        // --------------------------------------------
        // User denied / Meta error
        // --------------------------------------------

        if (error) {
            console.error(
                "Meta OAuth error:",
                error,
                errorDescription
            );

            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_BASE_URL}/integration/meta?error=${encodeURIComponent(
                    errorDescription ||
                    error ||
                    "Meta authorization failed"
                )}`
            );
        }

        // --------------------------------------------
        // Validate
        // --------------------------------------------

        if (!code || !state) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Missing OAuth code or state",
                },
                {
                    status: 400,
                }
            );
        }

        // --------------------------------------------
        // Verify OAuth state
        // --------------------------------------------

        const decoded =
            jwt.verify(
                state,
                process.env.META_OAUTH_STATE_SECRET
            );

        const sellerId =
            decoded.userId;

        if (!sellerId) {
            throw new Error(
                "Invalid OAuth state"
            );
        }

        await connectDB();

        // --------------------------------------------
        // IMPORTANT
        // Same redirect URI used during connect
        // --------------------------------------------

        const redirectUri =
            process.env.META_REDIRECT_URI;

        if (!redirectUri) {
            throw new Error(
                "META_REDIRECT_URI is missing"
            );
        }

        // --------------------------------------------
        // Exchange code for access token
        // --------------------------------------------

        const tokenUrl =
            new URL(
                `https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION}/oauth/access_token`
            );

        tokenUrl.searchParams.set(
            "client_id",
            process.env.META_APP_ID
        );

        tokenUrl.searchParams.set(
            "client_secret",
            process.env.META_APP_SECRET
        );

        tokenUrl.searchParams.set(
            "redirect_uri",
            redirectUri
        );

        tokenUrl.searchParams.set(
            "code",
            code
        );

        console.log(
            "Exchanging Meta code...",
            {
                redirectUri,
                graphVersion:
                    process.env.META_GRAPH_API_VERSION,
            }
        );

        const tokenResponse =
            await fetch(
                tokenUrl.toString(),
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

        const tokenData =
            await tokenResponse.json();

        console.log(
            "Meta token response:",
            {
                success:
                    !tokenData.error,
                error:
                    tokenData.error || null,
            }
        );

        if (
            !tokenResponse.ok ||
            tokenData.error
        ) {
            throw new Error(
                tokenData?.error?.message ||
                "Failed to exchange Meta authorization code"
            );
        }

        const userAccessToken =
            tokenData.access_token;

        if (!userAccessToken) {
            throw new Error(
                "Meta did not return an access token"
            );
        }

        // --------------------------------------------
        // Save integration
        // --------------------------------------------

        await Integration.findOneAndUpdate(
            {
                userId: sellerId,
                provider: "meta",
            },
            {
                $set: {
                    status: "connected",

                    credentials: {
                        accessToken:
                            userAccessToken,

                        refreshToken:
                            null,

                        apiKey:
                            null,

                        apiSecret:
                            null,

                        expiresAt:
                            null,
                    },

                    metadata: {
                        oauthConnected:
                            true,
                    },

                    connectedAt:
                        new Date(),

                    errorMessage:
                        null,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        // --------------------------------------------
        // Redirect back to seller panel
        // --------------------------------------------

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/integration/meta?connected=true`
        );

    } catch (error) {
        console.error(
            "Meta callback error:",
            error
        );

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_BASE_URL}/integration/meta?error=${encodeURIComponent(
                error.message
            )}`
        );
    }
}