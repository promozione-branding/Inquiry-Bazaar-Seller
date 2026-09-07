import Integration from "@/models/IntegrationSchema";
import Lead from "@/models/Leads";

const BRAND_BNALO_API = "https://brandbnalo.com/api/form/get-forms";

export async function syncBrandBnaloLeads(userId) {
    // console.log("=================================");
    console.log("🔄 Website lead sync started");
    // console.log("👤 User:", String(userId));

    try {
        if (!userId) {
            return {
                success: false,
                message: "userId is required",
                total: 0,
                imported: 0,
                skipped: 0,
                failed: 0,
                errors: [],
            };
        }

        /*
         * -----------------------------------------
         * 1. FIND WEBSITE INTEGRATION
         * -----------------------------------------
         */

        const integration =
            await Integration.findOne({
                userId,
                provider: "website",
                status: "connected",
            });

        if (!integration) {
            console.log(
                "❌ Website integration not connected"
            );

            return {
                success: false,
                message:
                    "Website integration is not connected",
                total: 0,
                imported: 0,
                skipped: 0,
                failed: 0,
                errors: [],
            };
        }

        /*
         * -----------------------------------------
         * 2. GET CONNECTION TIME
         * -----------------------------------------
         *
         * Only leads created AFTER this time
         * will be imported.
         */

        const connectedAt =
            integration.connectedAt;

        if (!connectedAt) {
            console.log(
                "❌ Integration connectedAt is missing"
            );

            return {
                success: false,
                message:
                    "Website integration connection time is missing",
                total: 0,
                imported: 0,
                skipped: 0,
                failed: 0,
                errors: [],
            };
        }

        // console.log(
        //     "🔗 Website connected at:",
        //     connectedAt
        // );

        /*
         * -----------------------------------------
         * 3. FETCH LEADS
         * -----------------------------------------
         */

        const sellerId = String(userId);

        const url =
            `${BRAND_BNALO_API}/` +
            encodeURIComponent(sellerId);

        // console.log(
        //     "🌐 Fetching leads from:",
        //     url
        // );

        const response = await fetch(url, {
            method: "GET",
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        console.log(
            "📡 Lead API status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Lead API returned ${response.status}`
            );
        }

        const result = await response.json();

        if (!result?.success) {
            throw new Error(
                result?.message ||
                "Lead API request failed"
            );
        }

        const leads = Array.isArray(result?.data)
            ? result.data
            : [];

        // console.log(
        //     `📥 API returned ${leads.length} leads`
        // );

        /*
         * -----------------------------------------
         * 4. COUNTERS
         * -----------------------------------------
         */

        let imported = 0;
        let skipped = 0;
        let failed = 0;

        const errors = [];

        /*
         * -----------------------------------------
         * 5. PROCESS LEADS
         * -----------------------------------------
         */

        for (const item of leads) {
            try {
                if (!item) {
                    skipped++;
                    continue;
                }

                /*
                 * ---------------------------------
                 * LEAD CREATED DATE
                 * ---------------------------------
                 */

                let leadCreatedAt = null;

                if (item.createdAt) {
                    const parsedDate =
                        new Date(item.createdAt);

                    if (
                        !Number.isNaN(
                            parsedDate.getTime()
                        )
                    ) {
                        leadCreatedAt = parsedDate;
                    }
                }

                /*
                 * If BrandBnalo doesn't provide
                 * createdAt, don't import it because
                 * we cannot know whether it's old.
                 */

                if (!leadCreatedAt) {
                    skipped++;

                    // console.log(
                    //     "⏭️ Skipping lead without createdAt:",
                    //     item?._id
                    // );

                    continue;
                }

                /*
                 * ---------------------------------
                 * IMPORTANT:
                 *
                 * Ignore all leads created BEFORE
                 * website connection.
                 * ---------------------------------
                 */

                if (
                    leadCreatedAt.getTime() <
                    new Date(
                        connectedAt
                    ).getTime()
                ) {
                    skipped++;

                    // console.log(
                    //     `⏭️ Old lead skipped: ${item?.name ||
                    //     "Unknown"
                    //     } | ${leadCreatedAt.toISOString()
                    //     }`
                    // );

                    continue;
                }

                /*
                 * ---------------------------------
                 * NORMALIZE DATA
                 * ---------------------------------
                 */

                const name =
                    typeof item.name === "string"
                        ? item.name.trim()
                        : "";

                const phone =
                    typeof item.phone === "string"
                        ? item.phone.trim()
                        : "";

                const email =
                    typeof item.email === "string"
                        ? item.email.trim()
                        : "";

                const companyName =
                    typeof item.companyName === "string"
                        ? item.companyName.trim()
                        : "";

                const gstNumber =
                    typeof item.gstNumber === "string"
                        ? item.gstNumber.trim()
                        : "";

                const place =
                    typeof item.place === "string"
                        ? item.place.trim()
                        : "";

                const product =
                    typeof item.product === "string"
                        ? item.product.trim()
                        : "";

                const message =
                    typeof item.message === "string"
                        ? item.message.trim()
                        : "";

                /*
                 * ---------------------------------
                 * UPDATED DATE
                 * ---------------------------------
                 */

                let leadUpdatedAt =
                    leadCreatedAt;

                if (item.updatedAt) {
                    const parsedUpdatedDate =
                        new Date(
                            item.updatedAt
                        );

                    if (
                        !Number.isNaN(
                            parsedUpdatedDate.getTime()
                        )
                    ) {
                        leadUpdatedAt =
                            parsedUpdatedDate;
                    }
                }

                /*
                 * ---------------------------------
                 * PRICE
                 * ---------------------------------
                 */

                let priceRange;

                if (
                    item.priceRange !== undefined &&
                    item.priceRange !== null &&
                    item.priceRange !== ""
                ) {
                    const parsedPrice =
                        Number(
                            item.priceRange
                        );

                    if (
                        !Number.isNaN(
                            parsedPrice
                        )
                    ) {
                        priceRange =
                            parsedPrice;
                    }
                }

                /*
                 * ---------------------------------
                 * DUPLICATE CHECK
                 * ---------------------------------
                 */

                const duplicateQuery = {
                    userId,
                    source: "website",
                };

                if (phone) {
                    duplicateQuery.phone =
                        phone;
                }

                duplicateQuery.createdAt = {
                    $gte: new Date(
                        leadCreatedAt.getTime() -
                        1000
                    ),

                    $lte: new Date(
                        leadCreatedAt.getTime() +
                        1000
                    ),
                };

                const existingLead =
                    await Lead.findOne(
                        duplicateQuery
                    ).lean();

                if (existingLead) {
                    skipped++;

                    // console.log(
                    //     `⏭️ Duplicate lead skipped: ${name || "Unknown"
                    //     }`
                    // );

                    continue;
                }

                /*
                 * ---------------------------------
                 * CREATE CRM LEAD
                 * ---------------------------------
                 */

                const lead =
                    await Lead.create({
                        userId,

                        source: "website",

                        name:
                            name ||
                            "Website Lead",

                        phone,

                        email:
                            email ||
                            undefined,

                        companyName,

                        gstNumber,

                        place,

                        product,

                        message,

                        priceRange,

                        dealValue: 0,

                        stage: "new",

                        status: "open",

                        createdAt:
                            leadCreatedAt,

                        updatedAt:
                            leadUpdatedAt,
                    });

                imported++;

                // console.log(
                //     `✅ Imported latest lead: ${lead.name
                //     } | ${lead.phone ||
                //     "No phone"
                //     }`
                // );
            } catch (error) {
                failed++;

                console.error(
                    "❌ Lead import failed:",
                    error?.message
                );

                errors.push({
                    id:
                        item?._id ||
                        null,

                    name:
                        item?.name ||
                        null,

                    phone:
                        item?.phone ||
                        null,

                    error:
                        error?.message ||
                        "Unknown error",
                });
            }
        }

        /*
         * -----------------------------------------
         * 6. UPDATE SYNC TIME
         * -----------------------------------------
         */

        await Integration.updateOne(
            {
                _id: integration._id,
            },
            {
                $set: {
                    lastSyncAt: new Date(),
                    errorMessage: null,
                },
            }
        );

        /*
         * -----------------------------------------
         * 7. RESULT
         * -----------------------------------------
         */

        // console.log("=================================");
        console.log(
            "✅ Website lead sync completed"
        );
        console.log(
            `📥 API leads: ${leads.length}`
        );
        // console.log(
        //     `✅ Imported: ${imported}`
        // );
        // console.log(
        //     `⏭️ Skipped: ${skipped}`
        // );
        console.log(
            `❌ Failed: ${failed}`
        );
        // console.log("=================================");

        return {
            success: true,

            message:
                "Latest website leads synced successfully",

            total: leads.length,

            imported,

            skipped,

            failed,

            errors,
        };
    } catch (error) {
        console.error(
            "❌ Website lead sync error:",
            error
        );

        try {
            await Integration.updateOne(
                {
                    userId,
                    provider: "website",
                },
                {
                    $set: {
                        lastSyncAt:
                            new Date(),

                        errorMessage:
                            error?.message ||
                            "Website lead sync failed",
                    },
                }
            );
        } catch (updateError) {
            console.error(
                "❌ Failed to update integration error:",
                updateError
            );
        }

        return {
            success: false,

            message:
                error?.message ||
                "Website lead sync failed",

            total: 0,

            imported: 0,

            skipped: 0,

            failed: 0,

            errors: [],
        };
    }
}