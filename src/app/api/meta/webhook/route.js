import { NextResponse } from "next/server";

import Integration from "@/models/IntegrationSchema";
import Lead from "@/models/Leads";
import { connectDB } from "@/config/db";
import { metaGet } from "@/utils/meta/graph";

export const runtime = "nodejs";


// =====================================================
// META WEBHOOK VERIFICATION
// =====================================================

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const mode =
            searchParams.get("hub.mode");

        const token =
            searchParams.get(
                "hub.verify_token"
            );

        const challenge =
            searchParams.get(
                "hub.challenge"
            );

        if (
            mode === "subscribe" &&
            token ===
            process.env
                .META_WEBHOOK_VERIFY_TOKEN
        ) {
            console.log(
                "Meta webhook verified"
            );

            return new Response(
                challenge,
                {
                    status: 200,
                }
            );
        }

        return new Response(
            "Forbidden",
            {
                status: 403,
            }
        );

    } catch (error) {
        console.error(
            "Meta webhook verification error:",
            error
        );

        return new Response(
            "Verification failed",
            {
                status: 500,
            }
        );
    }
}


// =====================================================
// META LEAD WEBHOOK
// =====================================================

export async function POST(request) {
    try {
        const body =
            await request.json();

        console.log(
            "META WEBHOOK:",
            JSON.stringify(
                body,
                null,
                2
            )
        );

        if (
            body.object !==
            "page"
        ) {
            return NextResponse.json({
                success: true,
            });
        }

        await connectDB();

        // ------------------------------------------------
        // Loop through entries
        // ------------------------------------------------

        for (
            const entry of
            body.entry || []
        ) {
            const pageId =
                entry.id;

            for (
                const change of
                entry.changes || []
            ) {
                if (
                    change.field !==
                    "leadgen"
                ) {
                    continue;
                }

                const value =
                    change.value || {};

                const leadgenId =
                    value.leadgen_id;

                const formId =
                    value.form_id;

                const adId =
                    value.ad_id;

                const adgroupId =
                    value.adgroup_id;

                const pageIdFromValue =
                    value.page_id ||
                    pageId;

                if (!leadgenId) {
                    console.log(
                        "No leadgen_id found"
                    );

                    continue;
                }

                // ------------------------------------------------
                // Find seller who connected this Facebook Page
                // ------------------------------------------------

                const integration =
                    await Integration.findOne(
                        {
                            provider:
                                "meta",

                            status:
                                "connected",

                            "metadata.pageId":
                                String(
                                    pageIdFromValue
                                ),
                        }
                    );

                if (!integration) {
                    console.error(
                        "No Meta integration found for Page:",
                        pageIdFromValue
                    );

                    continue;
                }

                const sellerId =
                    integration.userId;

                const pageAccessToken =
                    integration
                        .credentials
                        ?.accessToken;

                if (
                    !pageAccessToken
                ) {
                    console.error(
                        "Page access token missing"
                    );

                    continue;
                }

                // ------------------------------------------------
                // Prevent duplicate lead
                // ------------------------------------------------

                const existingLead =
                    await Lead.findOne({
                        metaLeadId:
                            String(
                                leadgenId
                            ),
                    });

                if (existingLead) {
                    console.log(
                        "Lead already exists:",
                        leadgenId
                    );

                    continue;
                }

                // ------------------------------------------------
                // Retrieve actual lead from Meta
                // ------------------------------------------------

                const metaLead =
                    await metaGet(
                        `/${leadgenId}`,
                        {
                            fields:
                                "id,created_time,field_data,campaign_id,campaign_name,ad_id,ad_name,adset_id,adset_name,is_organic,platform,form_id",
                        },
                        pageAccessToken
                    );

                console.log(
                    "META LEAD DATA:",
                    JSON.stringify(
                        metaLead,
                        null,
                        2
                    )
                );

                // ------------------------------------------------
                // Convert field_data to object
                // ------------------------------------------------

                const fields =
                    {};

                for (
                    const field of
                    metaLead.field_data ||
                    []
                ) {
                    if (
                        !field.name
                    ) {
                        continue;
                    }

                    const value =
                        field.values?.[0];

                    fields[
                        field.name
                    ] =
                        value ?? "";
                }

                console.log(
                    "NORMALIZED FIELDS:",
                    fields
                );

                // ------------------------------------------------
                // Flexible field mapping
                // ------------------------------------------------

                const name =
                    fields.full_name ||
                    fields.name ||
                    [
                        fields.first_name,
                        fields.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ") ||
                    "Facebook Lead";

                const phone =
                    fields.phone_number ||
                    fields.phone ||
                    fields.mobile ||
                    fields.whatsapp_number ||
                    null;

                const email =
                    fields.email ||
                    fields.email_address ||
                    null;

                const companyName =
                    fields.company_name ||
                    fields.company ||
                    null;

                const product =
                    fields.product ||
                    fields.product_name ||
                    fields.interested_product ||
                    fields.product_interest ||
                    null;

                const message =
                    fields.message ||
                    fields.requirement ||
                    fields.query ||
                    fields.details ||
                    null;

                const place =
                    fields.city ||
                    fields.location ||
                    fields.address ||
                    null;

                const gstNumber =
                    fields.gst_number ||
                    fields.gst ||
                    null;

                // ------------------------------------------------
                // Create Inquiry Bazaar Lead
                // ------------------------------------------------

                const lead =
                    await Lead.create({
                        userId:
                            sellerId,

                        source:
                            "facebook",

                        metaLeadId:
                            String(
                                leadgenId
                            ),

                        name,

                        phone,

                        email,

                        companyName,

                        gstNumber,

                        place,

                        product,

                        message,

                        dealValue: 0,

                        stage: "new",

                        status: "open",

                        campaignId:
                            metaLead.campaign_id ||
                            value.campaign_id ||
                            null,

                        campaignName:
                            metaLead.campaign_name ||
                            value.campaign_name ||
                            null,
                    });

                console.log(
                    "Inquiry Bazaar Lead Created:",
                    lead._id
                );

                // ------------------------------------------------
                // Update last sync
                // ------------------------------------------------

                await Integration.updateOne(
                    {
                        _id:
                            integration._id,
                    },
                    {
                        $set: {
                            lastSyncAt:
                                new Date(),

                            errorMessage:
                                null,
                        },
                    }
                );
            }
        }

        // Meta expects 200
        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Meta lead webhook error:",
            error
        );

        // IMPORTANT:
        // Meta should receive a response.
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