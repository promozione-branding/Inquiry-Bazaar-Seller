import { connectDB } from "@/config/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { uploadToR2 } from "@/utils/uploadToR2";

// ✅ slug function
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

// ✅ CREATE
export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();

    const name = formData.get("name");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const categoryDescription = formData.get("categoryDescription");
    const industryId = formData.get("industryId");
    const parentCategoryId = formData.get("parentCategoryId");

    const file = formData.get("file");

    // validation
    if (!name || !industryId) {
      return NextResponse.json(
        { message: "Name & Industry required" },
        { status: 400 }
      );
    }
    const slug = slugify(name);

    let imageUrl = "";
    let imageKey = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;

      const resUpload = await uploadToR2({
        file: buffer,
        folder: "categories",
        fileName,
        contentType: file.type,
      });

      imageUrl = resUpload.url;
      imageKey = resUpload.key;
    }

    const category = await Category.create({
      name,
      slug,
      metaTitle,
      metaDescription,
      categoryDescription,
      industryId,
      parentCategoryId: parentCategoryId || null,
      imageUrl,
      imageKey,
    });

    return NextResponse.json(
      { message: "Category created", data: category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type"); // main | sub
    const parentId = searchParams.get("parentId");

    let filter = {};

    // ✅ Main Categories
    if (type === "main") {
      filter.parentCategoryId = null;
    }

    // ✅ Sub Categories (all)
    if (type === "sub" && !parentId) {
      filter.parentCategoryId = { $ne: null };
    }

    // ✅ Sub Categories by Parent
    if (parentId) {
      filter.parentCategoryId = parentId;
    }

    const categories = await Category.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ data: categories });

  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}