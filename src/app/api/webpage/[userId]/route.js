import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Webpage from "@/models/UserWebpage";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { userId } = await params;

        if (!userId) {
            return NextResponse.json(
                { message: "UserId required" },
                { status: 400 }
            );
        }

        const data = await Webpage.findOne({ userId });

        return NextResponse.json(data || {});

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}