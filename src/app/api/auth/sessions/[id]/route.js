import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Session from "@/models/Session";

export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params; // ✅ FIXED

        if (!id) {
            return NextResponse.json(
                { success: false, message: "No Session found" },
                { status: 400 }
            );
        }

        await Session.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: "Device logged out",
        });

    } catch (err) {
        console.log(err);

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}