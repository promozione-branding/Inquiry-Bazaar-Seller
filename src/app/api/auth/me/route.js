import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/config/db";
import User from "@/models/User";
import Session from "@/models/Session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("inquiry_bazaar_token")?.value;

    // 🚀 EXIT FAST
    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // 🚀 VERIFY TOKEN FIRST
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const [session, user] = await Promise.all([
      Session.findById(decoded.sessionId),

      User.findById(decoded.id)
        .select("-password")
        .lean(),
    ]);

    if (!session) {
      const response = NextResponse.json(
        { user: null },
        { status: 401 }
      );

      response.cookies.set("inquiry_bazaar_token", "",
        {
          path: "/",
          maxAge: 0,
        }
      );

      return response;
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}