import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import Session from "@/models/Session";

export async function POST() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("promote_bharat_token")?.value;

    // 🔐 If token exists → delete session too
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded?.sessionId) {
          await Session.findByIdAndDelete(decoded.sessionId);
        }
      } catch (err) {
        console.log("Token invalid during logout");
      }
    }

    // 🍪 clear cookie properly
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    response.cookies.set("promote_bharat_token", "", {
      path: "/",
      maxAge: 0,
    });

    return response;

  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}