import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DropZone from "./DropZone";
import ImageCard from "./ImageCard";

export default function ImageUploader({
    images,
    setImages,
    openEditor,
}) {
    const addFiles = (files) => {
        const mapped = files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),

            type: file.type.startsWith("image")
                ? "image"
                : file.type.startsWith("video")
                ? "video"
                : "pdf",

            isPrimary:
                images.length === 0 && index === 0,

            isOld: false,
        }));

        setImages((prev) => [...prev, ...mapped]);
    };

    return (
        <div className="space-y-4 md:overflow-visible overflow-hidden">

            <DropZone onFiles={addFiles} />

            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        layout
                        className="grid gap-2 grid-cols-3"
                    >
                        {images.map((image, index) => (
                            <ImageCard
                                key={index}
                                image={image}
                                onClick={() =>
                                    openEditor(index)
                                }
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}