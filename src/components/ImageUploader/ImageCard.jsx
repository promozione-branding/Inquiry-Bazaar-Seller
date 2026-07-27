import React from "react";
import {
    Star,
    FileText,
    ImageIcon,
    PlayCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ImageCard({
    image,
    onClick,
}) {
    return (
        <motion.div
            layout
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className={`cursor-pointer xl:h-32 xl:w-32 overflow-hidden rounded-xl border bg-white shadow-sm relative 
            ${image.isPrimary
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
        >
            {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs rounded-full p-1 flex items-center gap-1 z-20">
                    <Star size={12} fill="white" />
                    {/* Primary */}
                </div>
            )}

            {image.type === "image" && (
                <img
                    src={image.preview || image.url}
                    alt=""
                    className="h-full w-full object-cover"
                />
            )}

            {image.type === "video" && (
                <div className="relative">
                    <video
                        src={image.preview || image.url}
                        className="h-full w-full object-cover"
                    />
                    <PlayCircle
                        size={36}
                        className="absolute inset-0 m-auto text-white"
                    />
                </div>
            )}

            {image.type === "pdf" && (
                <div className="h-full w-full flex flex-col justify-center items-center bg-gray-100">
                    <FileText size={40} />
                    <span className="text-sm mt-2">
                        PDF
                    </span>
                </div>
            )}

            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                <ImageIcon size={12} />
            </div>
        </motion.div>
    );
}