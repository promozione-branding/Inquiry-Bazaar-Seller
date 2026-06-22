import { Plus, Star, Trash2, ExternalLink, FileText } from "lucide-react";
import React, { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import toast from "react-hot-toast";

export default function ImageForm({ productId, setImages, images }) {
    const [processing, setProcessing] = useState(false);
    const handleFiles = (e) => {
        const files = Array.from(e.target.files);

        const previewFiles = files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),

            type: file.type.startsWith("image")
                ? "image"
                : file.type.startsWith("video")
                    ? "video"
                    : "pdf",

            isPrimary: images.length === 0 && index === 0,
            isOld: false,
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

    const urlToBlob = (url) => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Blob creation failed"));
                },
                "image/png"
            );
        };

        img.onerror = () => reject(new Error("Image load failed"));
        img.src = url + `?t=${Date.now()}`; // bypass cache
    });

    const removeBg = async (index) => {
        if (processing) return;

        try {
            setProcessing(true);
            const target = images[index];
            let source;

            if (target.file) {
                source = target.file;
            } else if (target.url) {
                source = await urlToBlob(target.url);
            }

            if (!source) {
                throw new Error("Source missing");
            }

            const resultBlob = await removeBackground(source);

            const filename = (target.file?.name || target.url?.split("/").pop() || "image")
                .replace(/\.\w+$/, "") + "-bg.webp";

            const newFile = new File(
                [resultBlob], filename, { type: "image/webp", }
            );

            const preview = URL.createObjectURL(resultBlob);

            setImages((prev) => prev.map((img, i) => i === index ? {
                ...img,
                mediaId: img.mediaId,
                file: newFile,
                preview,
                originalUrl: img.url,
                isOld: false,
                replaced: true,
                bgRemoved: true,
            } : img));

        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setProcessing(false);
        }
    };

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
                    <div
                        key={index}
                        className={`relative group rounded-lg border overflow-visible ${img.isPrimary ? "border-blue-500" : "border-gray-200"
                            }`}
                    >
                        {img.type === "pdf" ? (
                            <div className="h-24 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                                <FileText size={30} />
                            </div>
                        ) : img.type === "video" ? (
                            <video
                                src={img.preview || img.url}
                                className="h-24 w-full object-cover rounded-lg"
                                muted
                            />
                        ) : (
                            <img
                                src={img.preview || img.url}
                                className="h-20 w-full object-cover rounded-lg"
                                alt="preview"
                            />
                        )}

                        {/* Actions Dropdown */}
                        <div
                            className="
            absolute top-full left-0 right-0 mt-0.5
            flex flex-col gap-2
            opacity-0 translate-y-[-10px]
            pointer-events-none
            group-hover:opacity-100
            group-hover:translate-y-0
            group-hover:pointer-events-auto
            transition-all duration-300
            z-20
        "
                        >
                            {img.type === "image" && (
                                <>
                                    <button
                                        disabled={processing}
                                        onClick={() => removeBg(index)}
                                        className="
                        w-full px-3 py-2
                        rounded-md bg-white
                        shadow-lg border
                        text-purple-600
                        hover:bg-purple-50
                        disabled:opacity-50
                        text-xs font-medium text-nowrap flex justify-center
                    "
                                    >
                                        {processing ? "Processing..." : "Remove BG"}
                                    </button>

                                    {!img.isPrimary && (
                                        <button
                                            onClick={() => setPrimary(index)}
                                            className="
                            w-full px-3 py-2
                            rounded-md bg-white
                            shadow-lg border
                            text-yellow-600
                            hover:bg-yellow-50
                            flex items-center justify-center gap- text-nowrap
                            text-xs
                        "
                                        >
                                            <Star size={16} />
                                            Set Primary
                                        </button>
                                    )}
                                </>
                            )}

                            {img.type !== "image" && (
                                <a
                                    href={img.preview || img.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                    w-full py-2
                    rounded-md bg-white
                    shadow-lg border
                    text-blue-600
                    hover:bg-blue-50
                    flex items-center justify-center gap-1 text-xs
                "
                                >
                                    <ExternalLink size={16} />
                                    Open
                                </a>
                            )}

                            <button
                                onClick={() => removeImage(index)}
                                className="
                w-full py-2
                rounded-md bg-white
                shadow-lg border
                text-red-500
                hover:bg-red-50
                flex items-center justify-center gap-2 text-xs
            "
                            >
                                <Trash2 size={15} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {processing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        Removing background...
                    </div>
                </div>
            )}
        </div>
    );
}