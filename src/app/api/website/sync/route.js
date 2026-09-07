
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { getSellerIdFromRequest, } from "@/utils/meta/auth";
import { syncBrandBnaloLeads, } from "@/utils/integrations/syncLeads";
export const runtime = "nodejs";

export async function POST(request) {
    try {
        await connectDB();
        const userId = await getSellerIdFromRequest(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized", },
                { status: 401, }
            );
        }

        console.log("🔄 Manual website sync requested:", String(userId));
        const result = await syncBrandBnaloLeads(userId);
        return NextResponse.json(result, { status: result.success ? 200 : 400, });

    } catch (error) {
        console.error("❌ Website sync API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Website lead sync failed",
            },
            { status: 500, }
        );
    }
}