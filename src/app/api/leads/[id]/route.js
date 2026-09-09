import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/config/db";
import Lead from "@/models/Leads";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        // Check valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid lead ID",
                },
                { status: 400 }
            );
        }

        const lead = await Lead.findById(id).lean();

        if (!lead) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lead not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            lead,
        });
    } catch (error) {
        console.error("GET LEAD ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch lead",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;
        const body = await request.json();

        // Check valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid lead ID",
                },
                { status: 400 }
            );
        }

        // ============================================
        // ALLOWED FIELDS
        // ============================================
        const allowedFields = [
            "name",
            "phone",
            "email",
            "companyName",
            "gstNumber",
            "place",
            "product",
            "source",
            "priceRange",
            "dealValue",
            "expectedClosureDate",
            "stage",
            "status",
            "message",
            "remark",
            "campaignId",
            "campaignName",
        ];

        const updateData = {};

        // ============================================
        // ONLY ACCEPT ALLOWED FIELDS
        // ============================================
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // ============================================
        // NAME
        // ============================================
        if (updateData.name !== undefined) {
            if (
                typeof updateData.name !== "string" ||
                !updateData.name.trim()
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Lead name is required",
                    },
                    { status: 400 }
                );
            }

            updateData.name = updateData.name.trim();
        }

        // ============================================
        // STRING FIELDS
        // ============================================
        const stringFields = [
            "phone",
            "email",
            "companyName",
            "gstNumber",
            "place",
            "product",
            "message",
            "remark",
            "campaignId",
            "campaignName",
        ];

        for (const field of stringFields) {
            if (updateData[field] !== undefined) {
                if (updateData[field] === "") {
                    updateData[field] = undefined;
                } else if (typeof updateData[field] === "string") {
                    updateData[field] = updateData[field].trim();
                }
            }
        }

        // Email lowercase
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase();
        }

        // GST uppercase
        if (updateData.gstNumber) {
            updateData.gstNumber = updateData.gstNumber.toUpperCase();
        }

        // ============================================
        // PRICE RANGE
        // ============================================
        if (updateData.priceRange !== undefined) {
            if (updateData.priceRange === "") {
                updateData.priceRange = null;
            } else {
                const priceRange = Number(updateData.priceRange);

                if (Number.isNaN(priceRange)) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "Invalid price range",
                        },
                        { status: 400 }
                    );
                }

                updateData.priceRange = priceRange;
            }
        }

        // ============================================
        // DEAL VALUE
        // ============================================
        if (updateData.dealValue !== undefined) {
            if (updateData.dealValue === "") {
                updateData.dealValue = 0;
            } else {
                const dealValue = Number(updateData.dealValue);

                if (Number.isNaN(dealValue)) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "Invalid deal value",
                        },
                        { status: 400 }
                    );
                }

                updateData.dealValue = dealValue;
            }
        }

        // ============================================
        // EXPECTED CLOSURE DATE
        // ============================================
        if (updateData.expectedClosureDate !== undefined) {
            if (updateData.expectedClosureDate === "") {
                updateData.expectedClosureDate = null;
            } else {
                const date = new Date(
                    updateData.expectedClosureDate
                );

                if (Number.isNaN(date.getTime())) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "Invalid expected closure date",
                        },
                        { status: 400 }
                    );
                }

                updateData.expectedClosureDate = date;
            }
        }

        // ============================================
        // SOURCE VALIDATION
        // ============================================
        if (updateData.source !== undefined) {
            const validSources = [
                "facebook",
                "google",
                "website",
                "whatsapp",
                "manual",
                "indiamart",
                "tradeindia",
                "other",
            ];

            if (!validSources.includes(updateData.source)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid lead source",
                    },
                    { status: 400 }
                );
            }
        }

        // ============================================
        // STAGE VALIDATION
        // ============================================
        if (updateData.stage !== undefined) {
            const validStages = [
                "new",
                "contacted",
                "qualified",
                "proposal_sent",
                "negotiation",
                "won",
                "lost",
            ];

            if (!validStages.includes(updateData.stage)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid lead stage",
                    },
                    { status: 400 }
                );
            }
        }

        // ============================================
        // STATUS VALIDATION
        // ============================================
        if (updateData.status !== undefined) {
            const validStatuses = [
                "open",
                "closed",
                "junk",
            ];

            if (!validStatuses.includes(updateData.status)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid lead status",
                    },
                    { status: 400 }
                );
            }
        }

        // ============================================
        // CHECK EMPTY UPDATE
        // ============================================
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No fields to update",
                },
                { status: 400 }
            );
        }

        // ============================================
        // UPDATE
        // ============================================
        const lead = await Lead.findByIdAndUpdate(
            id,
            {
                $set: updateData,
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        if (!lead) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lead not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Lead updated successfully",
            lead,
        });
    } catch (error) {
        console.error("UPDATE LEAD ERROR:", error);

        // Mongoose validation error
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors)
                .map((err) => err.message)
                .join(", ");

            return NextResponse.json(
                {
                    success: false,
                    message: messages || "Validation failed",
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update lead",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        // Check valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid lead ID",
                },
                { status: 400 }
            );
        }

        const lead = await Lead.findByIdAndDelete(id);

        if (!lead) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lead not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        console.error("DELETE LEAD ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete lead",
            },
            { status: 500 }
        );
    }
}