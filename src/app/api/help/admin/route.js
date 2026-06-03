import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Help from "@/models/Help";

export async function GET() {
    try {
        await connectDB();

        const helps = await Help.find()
            .populate("userId", "name email role") // include specific user fields
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: helps,
        });

    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}