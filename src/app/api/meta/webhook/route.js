
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
            searchParams.get("hub.verify_token");

        const challenge =
            searchParams.get("hub.challenge");

        const verifyToken =
            process.env.META_WEBHOOK_VERIFY_TOKEN;

        if (
            mode === "subscribe" &&
            token === verifyToken
        ) {
            console.log(
                "META WEBHOOK VERIFIED"
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
            "META WEBHOOK VERIFICATION FAILED"
        );

        return new Response(
            "Forbidden",
            {
                status: 403,
            }
        );

    } catch (error) {

        console.error(
            "META WEBHOOK VERIFICATION ERROR:",
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

    console.log(
        "🔥🔥🔥 META WEBHOOK POST HIT 🔥🔥🔥"
    );

    try {

        // =================================================
        // READ META WEBHOOK BODY
        // =================================================

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


        // =================================================
        // CHECK META OBJECT
        // =================================================

        if (
            body.object !== "page"
        ) {

            console.log(
                "META EVENT IGNORED:",
                body.object
            );

            return NextResponse.json(
                {
                    success: true,
                },
                {
                    status: 200,
                }
            );
        }


        // =================================================
        // CONNECT DATABASE
        // =================================================

        await connectDB();


        // =================================================
        // LOOP THROUGH META ENTRIES
        // =================================================

        for (
            const entry of
            body.entry || []
        ) {

            /*
             * Meta Page ID comes from:
             *
             * entry.id
             */

            const pageId =
                String(entry.id || "");


            console.log(
                "META PAGE ID:",
                pageId
            );


            if (!pageId) {

                console.error(
                    "META PAGE ID MISSING"
                );

                continue;
            }


            // =================================================
            // LOOP THROUGH CHANGES
            // =================================================

            for (
                const change of
                entry.changes || []
            ) {

                /*
                 * We only process leadgen events.
                 */

                if (
                    change.field !== "leadgen"
                ) {

                    continue;
                }


                const value =
                    change.value || {};


                // =================================================
                // META LEAD INFORMATION
                // =================================================

                const metaLeadId =
                    value.leadgen_id;

                const formId =
                    value.form_id || null;

                const adId =
                    value.ad_id || null;

                const adsetId =
                    value.adset_id ||
                    value.adgroup_id ||
                    null;

                const campaignId =
                    value.campaign_id ||
                    null;


                console.log(
                    "NEW META LEAD EVENT:",
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
                // VALIDATE LEAD ID
                // =================================================

                if (!metaLeadId) {

                    console.error(
                        "No leadgen_id found"
                    );

                    continue;
                }


                // =================================================
                // FIND COMPANY INTEGRATION
                // =================================================

                const integration =
                    await Integration.findOne({
                        provider: "meta",

                        status: "connected",

                        "metadata.pageId":
                            pageId,
                    });


                if (!integration) {

                    console.error(
                        "No Meta integration found for Page:",
                        pageId
                    );

                    continue;
                }


                console.log(
                    "META INTEGRATION FOUND:",
                    integration._id
                );


                // =================================================
                // GET COMPANY ID
                // =================================================

                const companyId =
                    integration.companyId;


                if (!companyId) {

                    console.error(
                        "Company ID missing from Meta integration:",
                        integration._id
                    );

                    continue;
                }


                // =================================================
                // GET PAGE ACCESS TOKEN
                // =================================================

                /*
                 * IMPORTANT
                 *
                 * Your working CRM stores:
                 *
                 * metadata.pageAccessToken
                 *
                 * So use the same here.
                 */

                const pageAccessToken =
                    integration
                        .metadata
                        ?.pageAccessToken;


                if (!pageAccessToken) {

                    console.error(
                        "Page access token missing for Page:",
                        pageId
                    );

                    continue;
                }


                // =================================================
                // DUPLICATE CHECK
                // =================================================

                const existingLead =
                    await Lead.findOne({
                        metaLeadId:
                            String(metaLeadId),
                    });


                if (existingLead) {

                    console.log(
                        "Meta lead already exists:",
                        metaLeadId
                    );

                    continue;
                }


                // =================================================
                // GET ACTUAL LEAD FROM META
                // =================================================

                console.log(
                    "FETCHING META LEAD:",
                    metaLeadId
                );


                const metaLead =
                    await metaGet(
                        `/${metaLeadId}`,
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


                // =================================================
                // NORMALIZE FIELD DATA
                // =================================================

                const fields = {};


                for (
                    const field of
                    metaLead.field_data || []
                ) {

                    if (!field?.name) {
                        continue;
                    }


                    fields[field.name] =
                        field.values?.[0] ??
                        "";
                }


                console.log(
                    "NORMALIZED META FIELDS:",
                    fields
                );


                // =================================================
                // MAP LEAD NAME
                // =================================================

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


                // =================================================
                // MAP PHONE
                // =================================================

                const phone =
                    fields.phone_number ||
                    fields.phone ||
                    fields.mobile ||
                    fields.whatsapp_number ||
                    null;


                // =================================================
                // MAP EMAIL
                // =================================================

                const email =
                    fields.email ||
                    fields.email_address ||
                    null;


                // =================================================
                // MAP COMPANY
                // =================================================

                const companyName =
                    fields.company_name ||
                    fields.company ||
                    null;


                // =================================================
                // MAP PRODUCT
                // =================================================

                const product =
                    fields.product ||
                    fields.product_name ||
                    fields.interested_product ||
                    fields.product_interest ||
                    null;


                // =================================================
                // MAP MESSAGE
                // =================================================

                const message =
                    fields.message ||
                    fields.requirement ||
                    fields.query ||
                    fields.details ||
                    fields.comments ||
                    null;


                // =================================================
                // MAP LOCATION
                // =================================================

                const place =
                    fields.city ||
                    fields.location ||
                    fields.address ||
                    null;


                // =================================================
                // MAP GST
                // =================================================

                const gstNumber =
                    fields.gst_number ||
                    fields.gst_number_ ||
                    fields.gst ||
                    null;


                // =================================================
                // CAMPAIGN INFORMATION
                // =================================================

                const finalCampaignId =
                    campaignId ||
                    metaLead.campaign_id ||
                    null;


                const finalCampaignName =
                    metaLead.campaign_name ||
                    null;


                // =================================================
                // CREATE CRM LEAD
                // =================================================

                const lead =
                    await Lead.create({

                        /*
                         * NEW CRM USES companyId
                         */
                        companyId,

                        source:
                            "facebook",

                        metaLeadId:
                            String(metaLeadId),

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
                // UPDATE META INTEGRATION
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
                    "META INTEGRATION LAST SYNC UPDATED"
                );
            }
        }


        // =================================================
        // META WEBHOOK ACKNOWLEDGEMENT
        // =================================================

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
            "🔥 META LEAD WEBHOOK ERROR:",
            error
        );

        /*
         * Meta should receive 200 so that
         * it doesn't continuously retry
         * the same webhook event.
         *
         * Actual error is available
         * in server logs.
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