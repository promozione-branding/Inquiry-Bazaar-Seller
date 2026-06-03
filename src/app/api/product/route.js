import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import { uploadToR2 } from "@/utils/uploadToR2";
import ProductMedia from "@/models/ProductMedia";
import mongoose from "mongoose";

// ✅ slug function
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

// ✅ CREATE PRODUCT
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const body = {};

    // ✅ extract fields
    for (let [key, value] of formData.entries()) {
      if (
        key !== "files" &&
        key !== "isPrimary" &&
        key !== "specifications"
      ) {
        body[key] = value;
      }
    }

    // ✅ FIX: specifications parsing
    const rawSpecs = formData.get("specifications");

    if (rawSpecs) {
      try {
        body.specifications =
          typeof rawSpecs === "string"
            ? JSON.parse(rawSpecs)
            : [];
      } catch (err) {
        console.log("Spec parse error:", rawSpecs);
        body.specifications = []; // fallback
      }
    } else {
      body.specifications = [];
    }

    // ✅ slug logic
    let slug = slugify(body.name);
    let existing = await Product.findOne({ slug });
    let count = 1;

    while (existing) {
      slug = `${slugify(body.name)}-${count}`;
      existing = await Product.findOne({ slug });
      count++;
    }

    body.slug = slug;

    // ✅ create product
    const product = await Product.create(body);

    // ✅ images
    const files = formData.getAll("files");
    const primaryFlags = formData.getAll("isPrimary");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || file.size === 0) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;

      const uploadRes = await uploadToR2({
        file: buffer,
        folder: `products/${product._id}`,
        fileName,
        contentType: file.type,
      });

      const mediaType = file.type.startsWith("image/")
        ? "image" : file.type.startsWith("video/") ? "video"
          : file.type === "application/pdf" ? "pdf" : null;

      await ProductMedia.create({
        productId: product._id,
        type: mediaType,
        url: uploadRes.url,
        isPrimary: primaryFlags[i] === "true",
      });
    }

    return NextResponse.json({
      success: true,
      data: product,
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}

// ✅ GET ALL PRODUCTS
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const supplierId = searchParams.get("supplierId");

    let matchStage = {};

    if (supplierId) {
      matchStage.supplierId = new mongoose.Types.ObjectId(supplierId);
    }

    const products = await Product.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "productmedias",
          localField: "_id",
          foreignField: "productId",
          as: "media",
        },
      },

      {
        $addFields: {
          primaryImage: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$media",
                  as: "m",
                  cond: { $eq: ["$$m.isPrimary", true] },
                },
              },
              0,
            ],
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: products,
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}