import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Lead from "@/models/Leads";
import { getSellerIdFromRequest } from "@/utils/meta/auth";
// import your auth configuration if you use NextAuth

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const {
            source,
            name,
            phone,
            email,
            companyName,
            gstNumber,
            place,
            product,
            message,
            remark,
            priceRange,
            dealValue,
            expectedClosureDate,
            stage,
            status,
            campaignId,
            campaignName,
        } = body;


        if (!name?.trim()) {
            return NextResponse.json({ success: false, message: "Lead name is required", }, { status: 400 });
        }

        const userId = await getSellerIdFromRequest(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized", }, { status: 401 });
        }

        const lead = await Lead.create({
            userId: userId,
            source: source || "manual",
            name: name.trim(),
            phone: phone?.trim() || undefined,
            email: email?.trim().toLowerCase() || undefined,
            companyName: companyName?.trim() || undefined,
            gstNumber: gstNumber?.trim().toUpperCase() || undefined,
            place: place?.trim() || undefined,
            product: product?.trim() || undefined,
            message: message?.trim() || undefined,
            remark: remark?.trim() || undefined,
            priceRange:
                priceRange !== undefined &&
                    priceRange !== null &&
                    priceRange !== ""
                    ? Number(priceRange)
                    : undefined,

            dealValue:
                dealValue !== undefined &&
                    dealValue !== null &&
                    dealValue !== ""
                    ? Number(dealValue)
                    : 0,

            expectedClosureDate: expectedClosureDate
                ? new Date(expectedClosureDate)
                : undefined,
            stage: stage || "new",
            status: status || "open",
            campaignId: campaignId?.trim() || undefined,
            campaignName: campaignName?.trim() || undefined,
        });

        return NextResponse.json(
            { success: true, message: "Lead created successfully", data: lead, },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create lead error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create lead",
            },
            { status: 500 }
        );
    }
}