import SupplierSidebar from "@/components/Supplier/SupplierSidebar";
import ProductPage from "./ProductPage";
import axios from "axios";

// ✅ SEO META
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${slug}`,
      { cache: "no-store" } // or revalidate
    );

    const data = await res.json();
    if (!data?.success) {
      return {
        title: "Product Not Found",
        description: "No product found",
      };
    }

    const product = data.data;

    return {
      title: product.metaTitle || product.name,
      description:
        product.metaDescription ||
        product.description?.replace(/<[^>]+>/g, "").slice(0, 150),
    };

  } catch (err) {
    return {
      title: "Product",
      description: "Product page",
    };
  }
}

export default async function page({ params }) {
  const { slug } = await params;
  return (
    <div className="flex">
      <SupplierSidebar />
      <ProductPage slug={slug} />
    </div>
  );
}