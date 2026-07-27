import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
    X,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    Star,
    Trash2,
    Wand2,
} from "lucide-react";
import cropImage from "@/utils/cropImage";
import toast from "react-hot-toast";
import { removeBackground } from "@imgly/background-removal";

export default function ImageEditorModal({
    open,
    image,
    index,
    images,
    setImages,
    onClose,
}) {
    const [processing, setProcessing] = useState(false);;
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [flip, setFlip] = useState({
        horizontal: false,
        vertical: false,
    });

    useEffect(() => {
        if (!open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setFlip({
                horizontal: false,
                vertical: false,
            });
            setCroppedAreaPixels(null);
        }
    }, [open]);

    const getSource = async (img) => {
        if (img.file) return img.file;

        if (img.url) {
            return await urlToBlob(img.url);
        }

        throw new Error("Source image not found");
    };

    const urlToBlob = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Blob creation failed"));
                }, "image/png");
            };

            img.onerror = reject;
            img.src = url + "?t=" + Date.now();
        });

    const handleDone = async () => {
        if (!croppedAreaPixels) return;

        try {
            const source = await getSource(image);

            const blob = await cropImage(
                URL.createObjectURL(source),
                croppedAreaPixels,
                rotation,
                flip
            );

            const file = new File(
                [blob],
                image.file?.name || "image.webp",
                {
                    type: "image/webp",
                    lastModified: Date.now(),
                }
            );

            const preview = URL.createObjectURL(file);

            setImages((prev) =>
                prev.map((img, i) =>
                    i === index
                        ? {
                            ...img,
                            file,
                            preview,
                            url: undefined,
                            isOld: false,
                            replaced: true,
                        }
                        : img
                )
            );

            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Failed to edit image");
        }
    };

    const removeBg = async (index) => {
        if (processing) return;

        try {
            setProcessing(true);

            const target = images[index];
            const source = await getSource(target);

            const resultBlob = await removeBackground(source);

            const file = new File(
                [resultBlob],
                (target.file?.name || "image").replace(/\.\w+$/, "") + ".webp",
                {
                    type: "image/webp",
                }
            );

            const preview = URL.createObjectURL(file);

            setImages((prev) =>
                prev.map((img, i) =>
                    i === index
                        ? {
                            ...img,
                            file,
                            preview,
                            url: undefined,
                            originalUrl: img.url,
                            replaced: true,
                            bgRemoved: true,
                            isOld: false,
                        }
                        : img
                )
            );
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => {
            const removed = prev[index];

            if (removed?.preview?.startsWith("blob:")) {
                URL.revokeObjectURL(removed.preview);
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    const setPrimary = (index) => {
        setImages((prev) =>
            prev.map((img, i) => ({
                ...img,
                isPrimary: i === index,
            }))
        );
    };

    if (!open || !image) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
            <div className="bg-white rounded-xl w-[95vw] md:w-[80vw] h-[92vh] overflow-hidden flex flex-col">
                <div className="h-16 border-b flex items-center justify-between px-5">

                    <h2 className="font-semibold text-lg">
                        Edit Image
                    </h2>

                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>

                <div className="flex-1 relative bg-neutral-900">
                    <Cropper
                        image={image.preview || image.url}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        flip={flip}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                    />
                </div>

                <div className="border-t px-5 py-2 space-y-5">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 xl:flex hidden">

                            <label className="text-sm">
                                Zoom
                            </label>

                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) =>
                                    setZoom(Number(e.target.value))
                                }
                                className="w-full"
                            />

                        </div>

                        <div className="flex-1 xl:flex hidden">

                            <label className="text-sm">
                                Rotate
                            </label>

                            <input
                                type="range"
                                min={0}
                                max={360}
                                value={rotation}
                                onChange={(e) =>
                                    setRotation(Number(e.target.value))
                                }
                                className="w-full"
                            />

                        </div>

                        <button
                            className="px-4 py-2 rounded bg-yellow-100 text-yellow-500 flex items-center gap-2"
                            onClick={() => setPrimary(index)}
                        >
                            <Star size={18} />
                            Primary
                        </button>

                        <button
                            className="px-4 py-2 rounded bg-purple-100 text-purple-500 flex items-center gap-2"
                            onClick={() => removeBg(index)}
                        >
                            <Wand2 size={18} />
                            Remove BG
                        </button>

                        <button
                            className="px-4 py-2 rounded bg-orange-100 text-orange-500 flex items-center gap-2"
                            onClick={() =>
                                setRotation((p) => p + 90)
                            }
                        >
                            <RotateCw size={18} />
                            Rotate
                        </button>

                        <button onClick={() =>
                            setFlip((p) => ({
                                ...p,
                                horizontal: !p.horizontal,
                            }))
                        }
                            className="px-4 py-2 rounded bg-blue-100 text-blue-500 flex items-center gap-2"
                        >
                            <FlipHorizontal size={18} />
                            Flip H
                        </button>

                        <button onClick={() =>
                            setFlip((p) => ({
                                ...p,
                                vertical: !p.vertical,
                            }))
                        }
                            className="px-4 py-2 rounded bg-green-100 text-green-500 flex items-center gap-2"
                        >
                            <FlipVertical size={18} />
                            Flip V
                        </button>

                        <button
                            className="px-4 py-2 rounded bg-red-100 text-red-600 flex items-center gap-2"
                            onClick={() => {
                                removeImage(index);
                                onClose();
                            }}
                        >
                            <Trash2 size={18} />
                            Delete
                        </button>

                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleDone} className="bg-blue-600 text-white px-5 py-2 rounded">
                            Done
                        </button>
                    </div>
                </div>
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