
import { NextResponse } from "next/server";
import Integration from "@/models/IntegrationSchema";
import Lead from "@/models/Leads";
import { connectDB } from "@/config/db";
import { metaGet } from "@/utils/meta/graph";
export const runtime = "nodejs";

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const mode =
            searchParams.get("hub.mode");

        const token =
            searchParams.get("hub.verify_token");

        const challenge =
            searchParams.get("hub.challenge");

        const verifyToken =
            process.env.META_WEBHOOK_VERIFY_TOKEN;

        console.log("META WEBHOOK VERIFY:", {
            mode,
            hasToken: !!token,
            hasChallenge: !!challenge,
            tokenMatches: token === verifyToken,
        });

        if (
            mode === "subscribe" &&
            token === verifyToken
        ) {
            console.log(
                "✅ META WEBHOOK VERIFIED"
            );

            return new Response(
                challenge,
                {
                    status: 200,
                    headers: {
                        "Content-Type":
                            "text/plain",
                    },
                }
            );
        }

        console.error(
            "❌ META WEBHOOK VERIFICATION FAILED"
        );

        return new Response(
            "Forbidden",
            {
                status: 403,
            }
        );

    } catch (error) {
        console.error(
            "🔥 META WEBHOOK VERIFICATION ERROR:",
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

export async function POST(request) {
    console.log("🔥 META WEBHOOK POST HIT");

    try {
        const body = await request.json();
        console.log("📩 META WEBHOOK BODY:", JSON.stringify(body, null, 2));
        if (body?.object !== "page") {
            console.log("META EVENT IGNORED:", body?.object);
            return NextResponse.json({ success: true, }, { status: 200, });
        }

        await connectDB();

        for (const entry of body.entry || []) {

            // Meta Page ID
            const pageId = String(entry?.id || "");
            console.log("📄 META PAGE ID:", pageId);

            if (!pageId) {
                console.error("❌ META PAGE ID MISSING");
                continue;
            }

            for (const change of entry.changes || []) {

                console.log(
                    "META CHANGE:",
                    JSON.stringify(
                        change,
                        null,
                        2
                    )
                );


                // We only process leadgen
                if (
                    change?.field !==
                    "leadgen"
                ) {

                    console.log(
                        "Ignoring field:",
                        change?.field
                    );

                    continue;
                }


                const value =
                    change?.value || {};


                // =================================================
                // 6. GET META LEAD DATA
                // =================================================

                const metaLeadId =
                    value.leadgen_id
                        ? String(
                            value.leadgen_id
                        )
                        : null;

                const formId =
                    value.form_id
                        ? String(
                            value.form_id
                        )
                        : null;

                const adId =
                    value.ad_id
                        ? String(
                            value.ad_id
                        )
                        : null;

                const adsetId =
                    value.adset_id ||
                        value.adgroup_id
                        ? String(
                            value.adset_id ||
                            value.adgroup_id
                        )
                        : null;

                const campaignId =
                    value.campaign_id
                        ? String(
                            value.campaign_id
                        )
                        : null;


                console.log(
                    "🆕 NEW META LEAD EVENT:",
                    {
                        metaLeadId,
                        pageId,
                        formId,
                        adId,
                        adsetId,
                        campaignId,
                    }
                );


                // =================================================
                // 7. VALIDATE LEAD ID
                // =================================================

                if (!metaLeadId) {

                    console.error(
                        "❌ leadgen_id missing"
                    );

                    continue;
                }


                // =================================================
                // 8. FIND META INTEGRATION
                // =================================================

                /*
                 * IMPORTANT:
                 *
                 * Your Integration schema uses:
                 *
                 * userId
                 *
                 * NOT companyId.
                 */

                const integration =
                    await Integration.findOne({
                        provider: "meta",

                        status: "connected",

                        "metadata.pageId":
                            pageId,
                    });


                if (!integration) {

                    console.error(
                        "❌ NO META INTEGRATION FOUND"
                    );

                    console.error(
                        "Page ID:",
                        pageId
                    );

                    continue;
                }


                console.log(
                    "✅ META INTEGRATION FOUND:",
                    integration._id
                );


                // =================================================
                // 9. GET USER ID
                // =================================================

                const userId =
                    integration.userId;


                if (!userId) {

                    console.error(
                        "❌ USER ID MISSING FROM META INTEGRATION:",
                        integration._id
                    );

                    continue;
                }


                console.log(
                    "META INTEGRATION USER:",
                    userId
                );


                // =================================================
                // 10. GET PAGE ACCESS TOKEN
                // =================================================

                /*
                 * Your select-page API saves:
                 *
                 * metadata.pageAccessToken
                 *
                 * Therefore the webhook uses that token.
                 */

                const pageAccessToken =
                    integration
                        .metadata
                        ?.pageAccessToken;


                if (!pageAccessToken) {

                    console.error(
                        "❌ PAGE ACCESS TOKEN MISSING"
                    );

                    console.error(
                        "Integration:",
                        integration._id
                    );

                    console.error(
                        "Metadata:",
                        {
                            pageId:
                                integration.metadata
                                    ?.pageId,

                            pageName:
                                integration.metadata
                                    ?.pageName,

                            leadgenSubscribed:
                                integration.metadata
                                    ?.leadgenSubscribed,

                            hasPageAccessToken:
                                !!integration.metadata
                                    ?.pageAccessToken,
                        }
                    );

                    continue;
                }


                console.log(
                    "✅ PAGE ACCESS TOKEN FOUND"
                );


                // =================================================
                // 11. DUPLICATE CHECK
                // =================================================

                const existingLead =
                    await Lead.findOne({
                        metaLeadId:
                            metaLeadId,
                    });


                if (existingLead) {

                    console.log(
                        "⚠️ META LEAD ALREADY EXISTS:",
                        metaLeadId
                    );

                    continue;
                }


                // =================================================
                // 12. FETCH ACTUAL LEAD FROM META
                // =================================================

                console.log(
                    "🔄 FETCHING LEAD FROM META:",
                    metaLeadId
                );


                const metaLead =
                    await metaGet(
                        `/${metaLeadId}`,
                        {
                            fields:
                                "id,created_time,field_data,form_id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,is_organic,platform",
                        },
                        pageAccessToken
                    );


                console.log(
                    "✅ META LEAD FETCHED:",
                    JSON.stringify(
                        metaLead,
                        null,
                        2
                    )
                );


                // =================================================
                // 13. NORMALIZE FIELD DATA
                // =================================================

                const fields = {};


                for (
                    const field of
                    metaLead?.field_data || []
                ) {

                    if (
                        !field?.name
                    ) {
                        continue;
                    }

                    fields[field.name] =
                        field.values?.[0] ??
                        "";
                }


                console.log(
                    "📋 NORMALIZED FIELDS:",
                    fields
                );


                // =================================================
                // 14. NAME
                // =================================================

                const name =
                    fields.full_name ||
                    fields.name ||
                    [
                        fields.first_name,
                        fields.last_name,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .trim() ||
                    "Facebook Lead";


                // =================================================
                // 15. PHONE
                // =================================================

                const phone =
                    fields.phone_number ||
                    fields.phone ||
                    fields.mobile ||
                    fields.mobile_number ||
                    fields.whatsapp_number ||
                    null;


                // =================================================
                // 16. EMAIL
                // =================================================

                const email =
                    fields.email ||
                    fields.email_address ||
                    null;


                // =================================================
                // 17. COMPANY
                // =================================================

                const companyName =
                    fields.company_name ||
                    fields.company ||
                    null;


                // =================================================
                // 18. PRODUCT
                // =================================================

                const product = fields["what_products_are_you_interested_in?"] || fields.what_products_are_you_interested_in || fields.product || fields.product_name || fields.interested_product || fields.product_interest || null;


                // =================================================
                // 19. MESSAGE / REQUIREMENT
                // =================================================

                const message = fields.message || fields.requirement || fields.query || fields.details || fields.comments || fields["what_products_are_you_interested_in?"] || fields.what_products_are_you_interested_in || null;


                // =================================================
                // 20. LOCATION
                // =================================================

                const place =
                    fields.city ||
                    fields.location ||
                    fields.address ||
                    null;


                // =================================================
                // 21. GST
                // =================================================

                const gstNumber =
                    fields.gst_number ||
                    fields.gst_number_ ||
                    fields.gst ||
                    null;


                // =================================================
                // 22. CAMPAIGN DATA
                // =================================================

                const finalCampaignId =
                    campaignId ||
                    metaLead?.campaign_id ||
                    null;

                const finalCampaignName =
                    metaLead?.campaign_name ||
                    null;


                // =================================================
                // 23. CREATE CRM LEAD
                // =================================================

                console.log(
                    "💾 CREATING CRM LEAD..."
                );


                const lead =
                    await Lead.create({

                        /*
                         * IMPORTANT:
                         *
                         * Your current Integration
                         * schema is userId based.
                         *
                         * Therefore use userId here.
                         */

                        userId,

                        source:
                            "facebook",

                        metaLeadId:
                            metaLeadId,

                        name,

                        phone,

                        email,

                        companyName,

                        gstNumber,

                        place,

                        product,

                        message,

                        dealValue:
                            0,

                        stage:
                            "new",

                        status:
                            "open",

                        campaignId:
                            finalCampaignId,

                        campaignName:
                            finalCampaignName,

                        activities: [
                            {
                                type:
                                    "lead_created",

                                description:
                                    "Lead received from Facebook Lead Ads",
                            },
                        ],
                    });


                console.log(
                    "🎉 CRM LEAD CREATED:",
                    lead._id
                );


                // =================================================
                // 24. UPDATE INTEGRATION SYNC
                // =================================================

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


                console.log(
                    "✅ META INTEGRATION SYNC UPDATED"
                );
            }
        }


        // =================================================
        // 25. ACKNOWLEDGE META
        // =================================================

        console.log(
            "\n✅ META WEBHOOK PROCESSED\n"
        );


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
            "\n🔥🔥 META LEAD WEBHOOK ERROR 🔥🔥"
        );

        console.error(
            error
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Stack:",
            error?.stack
        );


        /*
         * Return 200 so Meta does not keep
         * retrying the same webhook.
         */

        return NextResponse.json(
            {
                success: true,
            },
            {
                status: 200,
            }
        );
    }
}