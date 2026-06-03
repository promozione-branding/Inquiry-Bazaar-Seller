import { connectDB } from "@/config/db";
import { registerUser } from "@/controllers/auth/authController";
import Session from "@/models/Session";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const user = await registerUser(body);
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);

    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";
    const deviceName = `${browser} on ${os}`;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // ✅ CREATE SESSION
    const session = await Session.create({
      userId: user._id,
      browser,
      os,
      deviceType,
      deviceName,
      ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // ✅ JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      process.env.JWT_SECRET, { expiresIn: "7d", }
    );

    // ✅ RESPONSE
    const response = NextResponse.json({
      success: true, message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 });

    // ✅ COOKIE
    response.cookies.set(
      process.env.COOKIE_NAME, token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}