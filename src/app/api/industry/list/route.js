import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Industry from "@/models/Industry";

export async function GET() {
  try {
    await connectDB();

    const industries = await Industry.find().sort({ createdAt: -1 });

    return NextResponse.json({ data: industries });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}