import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Session from "@/models/Session";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token =
      cookieStore.get("inquiry_bazaar_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const sessions = await Session.find({
      userId: decoded.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      sessions,
      currentSessionId: decoded.sessionId,
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}