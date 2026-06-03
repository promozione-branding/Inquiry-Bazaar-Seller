import { NextResponse } from "next/server";
import { uploadToR2 } from "@/utils/uploadToR2";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import User from "@/models/User";
import { connectDB } from "@/config/db";

export async function POST(req) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files allowed" },
        { status: 400 }
      );
    }

    // convert file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const folder = "profileImage";

    // ✅ delete old image if exists
    if (user.profileImageKey) {
      await deleteFromR2(user.profileImageKey);
    }

    // ✅ upload new
    const { key, url } = await uploadToR2({
      file: buffer,
      folder,
      fileName,
      contentType: file.type,
    });

    // ✅ update user
    user.profileImage = url;
    user.profileImageKey = key;

    await user.save();

    return NextResponse.json({
      success: true,
      url,
      key,
    });

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}