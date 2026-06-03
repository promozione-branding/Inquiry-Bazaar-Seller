import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Help from "@/models/Help";

const getUserId = (req) => {
  return req.headers.get("x-user-id");
};

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const userId = getUserId(req);
    console.log("BODY =>", body, userId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const help = await Help.create({
      ...body,
      userId: userId,
    });

    return NextResponse.json({
      success: true,
      data: help,
    });
  } catch (error) {
    console.error("ERROR =>", error); // 👈 VERY IMPORTANT

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const userId = getUserId(req);
    console.log(userId)
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const helps = await Help.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: helps,
    });

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}