import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Lead from "@/models/Leads";
import { getSellerIdFromRequest } from "@/utils/meta/auth";

/**
 * Get today's date in India as YYYY-MM-DD
 */
function getIndiaDate(offsetDays = 0) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const parts = formatter.formatToParts(new Date());

    let year;
    let month;
    let day;

    for (const part of parts) {
        if (part.type === "year") year = part.value;
        if (part.type === "month") month = part.value;
        if (part.type === "day") day = part.value;
    }

    // Create date based on IST calendar date
    const date = new Date(`${year}-${month}-${day}T00:00:00+05:30`);

    date.setUTCDate(date.getUTCDate() + offsetDays);

    const result = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return result.format(date);
}

/**
 * Convert an IST calendar date into UTC Date.
 *
 * Example:
 * 2026-09-09
 *
 * becomes:
 * 2026-09-08T18:30:00.000Z
 */
function istDateToUTC(dateString) {
    if (!dateString) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

    if (!match) {
        return null;
    }

    const [, year, month, day] = match;

    return new Date(
        `${year}-${month}-${day}T00:00:00.000+05:30`
    );
}

/**
 * Get exclusive end boundary for an IST date.
 *
 * Example:
 * 2026-09-09
 *
 * returns:
 * 2026-09-10T00:00:00+05:30
 */
function getISTNextDay(dateString) {
    if (!dateString) return null;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);

    if (!match) {
        return null;
    }

    const [, year, month, day] = match;

    const date = new Date(
        `${year}-${month}-${day}T00:00:00.000+05:30`
    );

    date.setUTCDate(date.getUTCDate() + 1);

    return date;
}

/**
 * Validate YYYY-MM-DD
 */
function isValidDateString(value) {
    if (!value) return false;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000+05:30`);

    return !Number.isNaN(date.getTime());
}

export async function GET(request) {
    try {
        await connectDB();

        // --------------------------------
        // Authenticate seller
        // --------------------------------
        const sellerId = getSellerIdFromRequest(request);

        if (!sellerId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        // --------------------------------
        // Query params
        // --------------------------------
        const { searchParams } = new URL(request.url);

        const page = Math.max(
            parseInt(searchParams.get("page") || "1", 10),
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(searchParams.get("limit") || "25", 10),
                1
            ),
            100
        );

        const filter =
            searchParams.get("filter") || "today";

        const search =
            searchParams.get("search")?.trim() || "";

        const startDateParam =
            searchParams.get("startDate");

        const endDateParam =
            searchParams.get("endDate");

        const skip = (page - 1) * limit;

        // --------------------------------
        // Base query
        // --------------------------------
        const query = {
            userId: sellerId,
        };

        // --------------------------------
        // Date filter
        // --------------------------------
        if (filter !== "all") {
            let startDate;
            let endDate;

            /**
             * TODAY
             *
             * Uses India date, not server date.
             */
            if (filter === "today") {
                const today = getIndiaDate();

                startDate = istDateToUTC(today);
                endDate = getISTNextDay(today);
            }

            /**
             * YESTERDAY
             */
            else if (filter === "yesterday") {
                const yesterday = getIndiaDate(-1);

                startDate = istDateToUTC(yesterday);
                endDate = getISTNextDay(yesterday);
            }

            /**
             * LAST 7 DAYS
             *
             * Includes today:
             *
             * today
             * -1
             * -2
             * -3
             * -4
             * -5
             * -6
             */
            else if (filter === "7days") {
                const startDateString = getIndiaDate(-6);
                const endDateString = getIndiaDate();

                startDate = istDateToUTC(startDateString);
                endDate = getISTNextDay(endDateString);
            }

            /**
             * LAST 30 DAYS
             *
             * Includes today.
             */
            else if (filter === "30days") {
                const startDateString = getIndiaDate(-29);
                const endDateString = getIndiaDate();

                startDate = istDateToUTC(startDateString);
                endDate = getISTNextDay(endDateString);
            }

            /**
             * CUSTOM DATE RANGE
             *
             * Example:
             *
             * startDate=2026-09-01
             * endDate=2026-09-09
             */
            else if (filter === "custom") {
                if (
                    !isValidDateString(startDateParam) ||
                    !isValidDateString(endDateParam)
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "Invalid startDate or endDate. Expected YYYY-MM-DD.",
                        },
                        { status: 400 }
                    );
                }

                startDate = istDateToUTC(startDateParam);
                endDate = getISTNextDay(endDateParam);

                // Prevent invalid reversed ranges
                if (startDate >= endDate) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "startDate must be before or equal to endDate.",
                        },
                        { status: 400 }
                    );
                }
            }

            // --------------------------------
            // Apply date query
            // --------------------------------
            if (startDate && endDate) {
                query.createdAt = {
                    $gte: startDate,
                    $lt: endDate,
                };
            }
        }

        // --------------------------------
        // Search
        // --------------------------------
        if (search) {
            const regex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                "i"
            );

            query.$or = [
                { name: regex },
                { phone: regex },
                { email: regex },
                { companyName: regex },
                { gstNumber: regex },
                { place: regex },
                { product: regex },
                { message: regex },
                { source: regex },
                { campaignName: regex },
            ];
        }

        // --------------------------------
        // Count
        // --------------------------------
        const total = await Lead.countDocuments(query);

        // --------------------------------
        // Get leads
        // --------------------------------
        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // --------------------------------
        // Pagination
        // --------------------------------
        const totalPages =
            total > 0 ? Math.ceil(total / limit) : 0;

        return NextResponse.json(
            {
                success: true,
                data: leads,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/leads/all error:", error);

        if (
            error.message === "Unauthorized" ||
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch leads",
            },
            { status: 500 }
        );
    }
}