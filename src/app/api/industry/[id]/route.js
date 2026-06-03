import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Industry from "@/models/Industry";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import { uploadToR2 } from "@/utils/uploadToR2";

// simple slug
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")          // replace &
    .replace(/[^a-z0-9]+/g, "-")   // replace special chars
    .replace(/--+/g, "-")          // remove double -
    .replace(/^-+|-+$/g, "");      // trim - from start/end

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();
    const name = formData.get("name");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const file = formData.get("file");

    const existing = await Industry.findById(id);
    if (!existing) {
      return NextResponse.json(
        { message: "Industry not found" },
        { status: 404 }
      );
    }

    let imageUrl = existing.imageUrl;
    let imageKey = existing.imageKey;
    if (file && file.size > 0) {
      if (existing.imageKey) {
        await deleteFromR2(existing.imageKey);
      }

      // 🔹 upload new image
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      const resUpload = await uploadToR2({
        file: buffer,
        folder: "industries",
        fileName,
        contentType: file.type,
      });

      imageUrl = resUpload.url;
      imageKey = resUpload.key;
    }

    const updated = await Industry.findByIdAndUpdate(
      id,
      {
        name,
        slug: name ? slugify(name) : existing.slug,
        metaTitle,
        metaDescription,
        imageUrl,
        imageKey,
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const industry = await Industry.findById(id);
    if (!industry) {
      return NextResponse.json(
        { message: "Industry not found" },
        { status: 404 }
      );
    }

    if (industry.imageKey) {
      await deleteFromR2(industry.imageKey);
    }

    await Industry.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}