"use client";
import ReviewSection from "@/components/Supplier/Product/ReviewSection";
import axios from "axios";
import {
  Tag,
  Layers,
  Boxes,
  BadgeIndianRupee,
  Truck,
  CreditCard,
  PackageOpen,
  Factory,
  Info,
  IndianRupee,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProductPage({ slug }) {
  // console.log(slug)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProduct = async () => {
    try {
      const res = await axios.get(`/api/product/${slug}`);
      // console.log(res)
      setProduct(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [slug]);

  const images = product?.media?.length ? product.media : [{ url: "/no-image.png" }];
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (images.length) {
      const index = images.findIndex((img) => img.isPrimary);
      setActiveImg(index >= 0 ? index : 0);
    }
  }, [product]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  return (
    <div className="p-6 w-full bg-gray-100 space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6 grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-50 h-96 rounded-xl flex items-center justify-center mb-4 border border-gray-200 overflow-hidden">
            <img
              src={images[activeImg]?.url || "/no-image.png"}
              className="h-full object-contain transition duration-300"
              alt="product"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            {images.map((img, i) => (
              <img
                key={i}
                src={img?.url || "/no-image.png"}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${activeImg === i
                  ? "border-[#0a5183] scale-105"
                  : "border-gray-200 hover:border-gray-400"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

          <div className="bg-[#f0f7fc] border border-[#cfe6f5] rounded-xl p-4 flex items-center gap-1">
            <div className="flex items-center gap-2 text-[#0a5183] text-2xl font-bold">
              <IndianRupee size={22} />
              {product.price || "Add Price"}
            </div>
            <span className="text-sm text-gray-600">/Piece</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoItem icon={Tag} label="Brand" value={product?.brandName} />
            <InfoItem icon={Tag} label="Category" value={product?.categoryId?.name} />
            <InfoItem icon={Layers} label="Sub Category" value={product?.subCategoryId?.name} />
            <InfoItem icon={Boxes} label="MOQ" value={product?.minOrderQty} />
            <InfoItem icon={BadgeIndianRupee} label="Price Type" value={product?.priceType} />
            <InfoItem icon={Truck} label="Delivery" value={product?.deliveryTime} />
            <InfoItem icon={CreditCard} label="Payment" value={product?.paymentTerms} />
            <InfoItem icon={PackageOpen} label="Packaging" value={product?.packagingDetails} />
            <InfoItem icon={Factory} label="Supply" value={product?.supplyAbility} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Description</h2>
          <div
            className=""
            dangerouslySetInnerHTML={{
              __html: product.description || "No description",
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-black text-center">Specifications</h2>

          {product.specifications?.length > 0 ? (
            <div className="space-y-2">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between border-b border-b-gray-300 pb-1">
                  <span className="text-gray-900 font-bold">● {spec.key}</span>
                  <span className="font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              No specifications added
            </p>
          )}
        </div>
      </div>

      <ReviewSection />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition">
      <div className="bg-[#e6f2f9] text-[#0a5183] p-2 rounded-md">
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="text-sm">
        <p className="text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}