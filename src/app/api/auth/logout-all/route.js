import { connectDB } from "@/config/db";
import Session from "@/models/Session";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token =
      cookieStore.get("inquiry_bazaar_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 🔥 DELETE ALL OTHER SESSIONS
    await Session.deleteMany({
      userId: decoded.id,
      _id: { $ne: decoded.sessionId },
    });

    return NextResponse.json({
      success: true,
      message: "All other devices logged out",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}