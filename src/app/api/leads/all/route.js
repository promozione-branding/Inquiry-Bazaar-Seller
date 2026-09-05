import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Lead from "@/models/Leads";
import { getSellerIdFromRequest } from "@/utils/meta/auth";

export async function GET(request) {
    try {
        await connectDB();

        // Get authenticated seller from JWT cookie
        const sellerId = getSellerIdFromRequest(request);

        const { searchParams } = new URL(request.url);

        const page = Math.max(
            parseInt(searchParams.get("page") || "1", 10),
            1
        );

        const limit = Math.min(
            Math.max(
                parseInt(searchParams.get("limit") || "9", 10),
                1
            ),
            100
        );

        const filter = searchParams.get("filter") || "today";
        const search = searchParams.get("search")?.trim() || "";

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
            const now = new Date();

            // Start of today
            const startOfToday = new Date(now);
            startOfToday.setHours(0, 0, 0, 0);

            let startDate;
            let endDate;

            switch (filter) {
                case "today":
                    startDate = startOfToday;
                    endDate = new Date(startOfToday);
                    endDate.setDate(endDate.getDate() + 1);
                    break;

                case "yesterday":
                    startDate = new Date(startOfToday);
                    startDate.setDate(startDate.getDate() - 1);

                    endDate = new Date(startOfToday);
                    break;

                case "7days":
                    startDate = new Date(startOfToday);
                    startDate.setDate(startDate.getDate() - 6);

                    endDate = new Date(now);
                    endDate.setDate(endDate.getDate() + 1);
                    endDate.setHours(0, 0, 0, 0);
                    break;

                case "30days":
                    startDate = new Date(startOfToday);
                    startDate.setDate(startDate.getDate() - 29);

                    endDate = new Date(now);
                    endDate.setDate(endDate.getDate() + 1);
                    endDate.setHours(0, 0, 0, 0);
                    break;

                default:
                    break;
            }

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
            const regex = new RegExp(search, "i");

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
        // Count total matching leads
        // --------------------------------
        const total = await Lead.countDocuments(query);

        // --------------------------------
        // Get paginated leads
        // --------------------------------
        const leads = await Lead.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(total / limit);

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
        console.error("GET /api/leads error:", error);

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