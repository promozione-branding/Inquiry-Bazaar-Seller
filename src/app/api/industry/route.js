// app/api/industry/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Industry from "@/models/Industry";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";

// ✅ Simple slug generator
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")          // replace &
    .replace(/[^a-z0-9]+/g, "-")   // replace special chars
    .replace(/--+/g, "-")          // remove double -
    .replace(/^-+|-+$/g, "");      // trim - from start/end

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const file = formData.get("file");

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const exists = await Industry.findOne({ slug });
    if (exists) {
      return NextResponse.json(
        { message: "Industry already exists" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    let imageKey = "";

    if (file && file.size > 0) {
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

    const industry = await Industry.create({
      name,
      slug,
      metaTitle: metaTitle || name,
      metaDescription: metaDescription || `Explore ${name}`,
      imageUrl,
      imageKey,
    });
    return NextResponse.json(industry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const industries = await Industry.find().lean();
    const categories = await Category.find().lean();

    // 🧠 build nested structure
    const result = industries.map((industry) => {
      const mainCats = categories.filter(
        (c) =>
          c.industryId.toString() === industry._id.toString() &&
          !c.parentCategoryId
      );

      const mainCategory = mainCats.map((main) => {
        const subs = categories.filter(
          (c) =>
            c.parentCategoryId &&
            c.parentCategoryId.toString() === main._id.toString()
        );

        return {
          ...main,
          subCategory: subs, // ✅ full data
        };
      });

      return {
        ...industry,
        mainCategory,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}