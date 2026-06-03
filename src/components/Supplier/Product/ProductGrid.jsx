import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductGrid({ products = [], loading, handleEdit, handleDelete }) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 bg-white p-4 rounded-lg shadow">
            {loading &&
                Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white p-2 rounded-xl shadow animate-pulse border border-gray-300">
                        <div className="h-40 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}

            {!loading &&
                products.map((item) => (
                    <div key={item?._id} className="bg-white p-2 rounded-xl shadow hover:shadow-md transition border border-gray-200">
                        <div className="h-40 w-full mb-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                            <img
                                src={
                                    item?.primaryImage?.url ||
                                    item?.media?.[0]?.url ||
                                    "/no-image.png"
                                }
                                alt={item?.name || "product"}
                                className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        <Link href={`/supplier/products/${item?.slug}`} className="font-bold text-black text-lg px-1.5">
                            {item.name}
                        </Link>

                        <div className="flex items-center justify-between px-1.5">
                            <p className="text-base font-semibold text-gray-800">
                                ₹ {item.price || "Get Best Price"}
                            </p>

                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(item)} className="mini-btn-blue">
                                    <Edit size={18} />
                                </button>

                                <button onClick={() => handleDelete(item._id)} className="mini-btn-danger">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}