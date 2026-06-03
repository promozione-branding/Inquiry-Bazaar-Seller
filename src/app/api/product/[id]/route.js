import { NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import Product from "@/models/Product";
import ProductMedia from "@/models/ProductMedia";
import Category from "@/models/Category";
import { uploadToR2 } from "@/utils/uploadToR2";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import Business from "@/models/UserBusiness";
import User from "@/models/User";

// ✅ slug function
const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

// ✅ UPDATE
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();
    const body = {};

    for (let [key, value] of formData.entries()) {
      if (
        key !== "files" &&
        key !== "specifications" &&
        key !== "imagesState"
      ) {
        body[key] = value;
      }
    }

    const rawSpecs = formData.get("specifications");
    if (rawSpecs) {
      try {
        body.specifications = JSON.parse(rawSpecs);
      } catch {
        body.specifications = [];
      }
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      });
    }

    if (body.name && body.name !== existingProduct.name) {
      let slug = slugify(body.name);
      let existing = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      let count = 1;
      while (existing) {
        slug = `${slugify(body.name)}-${count}`;
        existing = await Product.findOne({
          slug,
          _id: { $ne: id },
        });
        count++;
      }
      body.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
    });

    const imagesStateRaw = formData.get("imagesState");
    const imagesState = imagesStateRaw ? JSON.parse(imagesStateRaw) : [];

    const existingMedia = await ProductMedia.find({ productId: id });

    for (let media of existingMedia) {
      const stillExists = imagesState.find(
        (img) => img.url && img.url === media.url
      );

      if (!stillExists) {
        const key = media.url.split(".r2.dev/")[1];
        if (key) {
          await deleteFromR2(key);
        }
        await ProductMedia.findByIdAndDelete(media._id);
      }
    }

    const files = formData.getAll("files");
    let fileIndex = 0;
    for (let img of imagesState) {
      if (!img.isOld) {
        const file = files[fileIndex++];
        if (!file) continue;
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const uploadRes = await uploadToR2({
          file: buffer,
          folder: `products/${id}`,
          fileName,
          contentType: file.type,
        });

        const mediaType = file.type.startsWith("image/")
          ? "image" : file.type.startsWith("video/") ? "video"
            : file.type === "application/pdf" ? "pdf" : null;

        await ProductMedia.create({
          productId: id,
          type: mediaType,
          url: uploadRes.url,
          isPrimary: img.isPrimary,
        });
      }
    }

    for (let img of imagesState) {
      if (img.isOld && img.url) {
        await ProductMedia.updateOne(
          { productId: id, url: img.url },
          { $set: { isPrimary: img.isPrimary } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}

// ✅ DELETE
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

// Get
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // slug
    // console.log(id)
    const product = await Product.findOne({ slug: id })
      .populate("categoryId", "name slug")
      .populate("subCategoryId", "name slug")
      .populate("supplierId", "-password");

    const business = await Business.findOne({
      userId: product.supplierId._id,
    });

    const media = await ProductMedia.find({
      productId: product._id,
    });

    const primaryImage = media.find((m) => m.isPrimary);
    if (!product || product.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product.toObject(),
        media,
        primaryImage,
        supplierId: {
          ...product.supplierId.toObject(),
          business,
        },
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}