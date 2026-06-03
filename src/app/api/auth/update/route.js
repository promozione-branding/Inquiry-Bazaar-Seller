import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { updateUser } from "@/controllers/auth/authController";
import bcrypt from "bcryptjs";

const getUserId = (req) => {
  return req.headers.get("x-user-id");
};

export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updatedUser = await updateUser(userId, body);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}