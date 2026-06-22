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

    for (const [key, value] of formData.entries()) {
      if (key !== "files" && key !== "imagesState" && key !== "specifications") {
        body[key] = value;
      }
    }

    try {
      body.specifications = JSON.parse(formData.get("specifications") || "[]");
    } catch {
      body.specifications = [];
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      });
    }

    // Generate slug
    if (body.name && body.name !== existingProduct.name) {
      let slug = slugify(body.name);
      let exists = await Product.findOne({ slug, _id: { $ne: id }, });
      let count = 1;

      while (exists) {
        slug = `${slugify(body.name)}-${count}`;
        exists = await Product.findOne({ slug, _id: { $ne: id }, });
        count++;
      }

      body.slug = slug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, body, { new: true, }
    );

    const imagesState = JSON.parse(formData.get("imagesState") || "[]");
    const existingMedia = await ProductMedia.find({ productId: id, });

    // DELETE REMOVED MEDIA
    for (const media of existingMedia) {
      const exists = imagesState.find((img) =>
        img.mediaId?.toString() === media._id.toString()
      );

      // replaced handled later
      if (exists?.replaced) {
        continue;
      }

      if (!exists) {
        const key = media.url?.split(".r2.dev/")[1];
        if (key) {
          await deleteFromR2(key);
        }
        await ProductMedia.findByIdAndDelete(media._id);
      }
    }

    const files = formData.getAll("files");
    let fileIndex = 0;

    for (const img of imagesState) {
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
          ? "image" : file.type.startsWith("video/")
            ? "video" : "pdf";

        // REPLACE EXISTING IMAGE
        if (img.replaced && img.mediaId) {
          const oldMedia = await ProductMedia.findById(img.mediaId);

          if (oldMedia?.url) {
            const key = oldMedia.url.split(".r2.dev/")[1];
            if (key) {
              await deleteFromR2(key);
            }
          }

          await ProductMedia.findByIdAndUpdate(img.mediaId, {
            url: uploadRes.url,
            type: mediaType,
            isPrimary: img.isPrimary,
          });
        } else {
          await ProductMedia.create({
            productId: id,
            type: mediaType,
            url: uploadRes.url,
            isPrimary: img.isPrimary,
          });
        }
      }
    }

    // UPDATE EXISTING MEDIA
    for (const img of imagesState) {
      if (img.isOld && img.mediaId) {

        await ProductMedia.findByIdAndUpdate(img.mediaId, {
          isPrimary: img.isPrimary,
        });
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

// ✅ DELETE PRODUCT + MEDIA + R2 FILES
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      });
    }

    // Get all product media
    const media = await ProductMedia.find({ productId: id, });

    // Delete images from R2
    for (const item of media) {
      try {
        if (item.url) {
          const key = item.url.split(".r2.dev/")[1];
          if (key) {
            await deleteFromR2(key);
          }
        }
      } catch (err) {
        console.error("R2 delete failed:", item.url
        );
      }
    }

    await ProductMedia.deleteMany({ productId: id, });

    // Delete product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500, }
    );
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