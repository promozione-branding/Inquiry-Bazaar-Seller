import React from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function DropZone({ onFiles }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [],
            "video/*": [],
            "application/pdf": [],
        },
        multiple: true,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length) {
                onFiles(acceptedFiles);
            }
        },
    });

    return (
        <motion.div
            layout
            {...getRootProps()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`border-2 border-dashed rounded-2xl transition-all cursor-pointer p-10 flex flex-col items-center justify-center
            ${isDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-blue-500"
                }`}
        >
            <input {...getInputProps()} />

            <UploadCloud size={55} className="text-blue-600 mb-4" />

            <h3 className="text-lg font-semibold">
                Drag & Drop Images
            </h3>

            <p className="text-gray-500 mt-2 text-sm text-center">
                or click here to browse
            </p>
        </motion.div>
    );
}