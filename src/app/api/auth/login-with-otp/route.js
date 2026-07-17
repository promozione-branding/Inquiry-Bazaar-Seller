import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import User from "@/models/User";
import Session from "@/models/Session";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";

export async function POST(req) {
  try {
    await connectDB();

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // Find User
    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check Role
    if (user.role !== "supplier") {
      return NextResponse.json(
        {
          success: false,
          message: "Supplier profile not found",
        },
        { status: 400 }
      );
    }

    // Device Information
    const userAgent = req.headers.get("user-agent") || "";

    const parser = new UAParser(userAgent);

    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type || "desktop";

    const deviceName = `${browser} on ${os}`;

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Create Session
    const session = await Session.create({
      userId: user._id,
      browser,
      os,
      deviceType,
      deviceName,
      ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        sessionId: session._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    // Cookie
    response.cookies.set(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(process.env.NODE_ENV === "production" && {
        domain: ".inquirybazaar.com",
      }),
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}