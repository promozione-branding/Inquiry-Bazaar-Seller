import { Plus, Star, Trash2, ExternalLink, FileText } from "lucide-react";
import React, { useState } from "react";

export default function ImageForm({ productId, setImages, images }) {
    const handleFiles = (e) => {
        const files = Array.from(e.target.files);

        const previewFiles = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isPrimary: images.length === 0,
            isOld: false, // 🔥 NEW IMAGE
        }));

        setImages((prev) => [...prev, ...previewFiles]);
    };

    const removeImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    const setPrimary = (index) => {
        const updated = images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
        }));
        setImages(updated);
    };

    // console.log(images)
    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 h-fit">
            <div className="w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                {images[0] ? (
                    <img
                        src={
                            images.find((i) => i.isPrimary)?.preview ||
                            images.find((i) => i.isPrimary)?.url ||
                            images[0]?.preview ||
                            images[0]?.url ||
                            "/no-image.png"
                        }
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400">No Image</span>
                )}
                <label className="absolute bottom-1 right-1 rounded-full p-2 bg-[#0a5183] hover:bg-[#074977] text-white cursor-pointer">
                    <Plus size={20} />
                    <input type="file" multiple className="hidden" onChange={handleFiles} />
                </label>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, index) => (
                    <div key={index} className={`relative group rounded-lg overflow-hidden border ${img.isPrimary ? "border-blue-500" : "border-gray-200"}`}>
                        {img.type === "pdf" ? (
                            <div className="h-24 w-full flex items-center justify-center bg-gray-100">
                                <FileText size={30} />
                            </div>
                        ) : img.type === "video" ? (
                            <video
                                src={img.preview || img.url}
                                className="h-24 w-full object-cover"
                                muted
                            />
                        ) : (
                            <img
                                src={img.preview || img.url}
                                className="h-24 w-full object-cover"
                                alt=""
                            />
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                            {img.type === "image" ? (
                                <>
                                    {!img.isPrimary && (
                                        <button onClick={() => setPrimary(index)} className="bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600">
                                            <Star size={14} />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <a
                                    href={img.preview || img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            )}

                            <button onClick={() => removeImage(index)} className="bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {img.isPrimary && img.type === "image" && (
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white p-1 rounded">
                                <Star size={14} />
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}