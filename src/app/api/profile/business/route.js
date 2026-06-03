import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { upsertBusiness, getBusiness } from "@/controllers/Profile/businessController";

/* 🔹 Helper: Get User ID (replace with your auth) */
const getUserId = (req) => {
  // Example: from headers / token
  return req.headers.get("x-user-id");
};

/* CREATE / UPDATE */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await upsertBusiness(userId, body);

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* GET */
export async function GET(req) {
  try {
    await connectDB();

    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await getBusiness(userId);

    return NextResponse.json({
      success: true,
      data: business,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}