import { connectDB } from "@/config/db";
import Category from "@/models/Category";
import { deleteFromR2 } from "@/utils/deleteFromR2";
import { uploadToR2 } from "@/utils/uploadToR2";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import ProductMedia from "@/models/ProductMedia";
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

// ✏️ UPDATE
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const formData = await req.formData();
    const name = formData.get("name");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const categoryDescription = formData.get("categoryDescription");
    const industryId = formData.get("industryId");
    const parentCategoryId = formData.get("parentCategoryId");
    const file = formData.get("file");
    const existing = await Category.findById(id);

    if (!existing) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    let imageUrl = existing.imageUrl;
    let imageKey = existing.imageKey;
    if (file && file.size > 0) {
      if (existing.imageKey) {
        await deleteFromR2(existing.imageKey);
      }
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

    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: name ? slugify(name) : existing.slug,
        metaTitle,
        metaDescription,
        categoryDescription,
        industryId,
        parentCategoryId: parentCategoryId || null,
        imageUrl,
        imageKey,
      },
      { new: true }
    );

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    if (category.imageKey) {
      await deleteFromR2(category.imageKey);
    }
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

// export async function GET(req, { params }) {
//   try {
//     await connectDB();

//     const { id } = await params;

//     // 1. Get main category
//     const category = await Category.findById(id).lean();

//     if (!category) {
//       return NextResponse.json(
//         { message: "Category not found" },
//         { status: 404 }
//       );
//     }

//     // 2. Get subcategories
//     const subcategories = await Category.find({
//       parentCategoryId: id,
//     }).lean();

//     const subCategoryIds = subcategories.map((sub) => sub._id);

//     // 3. Get all products of subcategories
//     const products = await Product.find({
//       subCategoryId: { $in: subCategoryIds },
//     })
//       .populate("supplierId")
//       .sort({ createdAt: -1 })
//       .lean();

//     // 4. Get all media
//     const productIds = products.map((p) => p._id);

//     const media = await ProductMedia.find({
//       productId: { $in: productIds },
//     }).lean();

//     // 5. Attach media to products
//     const productsWithMedia = products.map((product) => ({
//       ...product,
//       media: media.filter(
//         (m) => m.productId.toString() === product._id.toString()
//       ),
//     }));

//     // 6. Attach products to subcategories
//     const subcategoriesWithProducts = subcategories.map((sub) => ({
//       ...sub,
//       products: productsWithMedia.filter(
//         (p) => p.subCategoryId?.toString() === sub._id.toString()
//       ),
//     }));

//     return NextResponse.json({
//       data: {
//         category,
//         subcategories: subcategoriesWithProducts,
//       },
//     });

//   } catch (error) {
//     return NextResponse.json(
//       { message: "Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    // 1. Find category
    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // 👉 CASE 1: MAIN CATEGORY (no parent)
    if (!category.parentCategoryId) {
      // Get subcategories
      const subcategories = await Category.find({
        parentCategoryId: id,
      }).lean();

      const subIds = subcategories.map((sub) => sub._id);

      // Get products of all subcategories
      const products = await Product.find({
        subCategoryId: { $in: subIds },
      })
        .populate("supplierId")
        .sort({ createdAt: -1 })
        .lean();

      // Get media
      const productIds = products.map((p) => p._id);

      const media = await ProductMedia.find({
        productId: { $in: productIds },
      }).lean();

      // Attach media
      const productsWithMedia = products.map((product) => ({
        ...product,
        media: media.filter(
          (m) => m.productId.toString() === product._id.toString()
        ),
      }));

      // Attach products to each subcategory
      const subcategoriesWithProducts = subcategories.map((sub) => ({
        ...sub,
        products: productsWithMedia.filter(
          (p) => p.subCategoryId?.toString() === sub._id.toString()
        ),
      }));

      return NextResponse.json({
        data: {
          category,
          subcategories: subcategoriesWithProducts,
        },
      });
    }

    // 👉 CASE 2: SUBCATEGORY
    else {
      const products = await Product.find({
        subCategoryId: id,
      })
        .populate("supplierId")
        .sort({ createdAt: -1 })
        .lean();

      const productIds = products.map((p) => p._id);

      const media = await ProductMedia.find({
        productId: { $in: productIds },
      }).lean();

      const productsWithMedia = products.map((product) => ({
        ...product,
        media: media.filter(
          (m) => m.productId.toString() === product._id.toString()
        ),
      }));

      return NextResponse.json({
        data: {
          category,
          products: productsWithMedia,
        },
      });
    }

  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}