import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js"; // ✅ FIXED

export async function POST(req) {
  try {
    await connectDB();

    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    // =========================
    // DEVICE INFO
    // =========================
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);

    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";

    const deviceName = `${browser} on ${os}`;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    // =========================
    // SESSION CREATE
    // =========================
    const session = await Session.create({
      userId: user._id,
      browser,
      os,
      deviceType,
      deviceName,
      ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // =========================
    // JWT
    // =========================
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // =========================
    // RESPONSE + COOKIE
    // =========================
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("promote_bharat_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}