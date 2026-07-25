"use client";

import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    FaTrash,
    FaEye,
    FaFileExcel,
    FaFileImage,
    FaFileAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function Docs({ user }) {
    const [docs, setDocs] = useState([]);

    const fetchDocs = async () => {
        const res = await axios.get("/api/docs", {
            params: { user },
        });

        setDocs(res.data);
    };

    useEffect(() => {
        fetchDocs();
    }, [user]);

    const onDrop = async (acceptedFiles) => {
        const loadingToast = toast.loading("Uploading documents...");

        try {
            for (const file of acceptedFiles) {
                const form = new FormData();

                form.append("file", file);
                form.append("userId", user);

                await axios.post("/api/docs", form);
            }

            await fetchDocs();

            toast.success("Documents uploaded successfully!", {
                id: loadingToast,
            });
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message || "Failed to upload documents.",
                {
                    id: loadingToast,
                }
            );
        }
    };

    const deleteDoc = async (id) => {
        const loadingToast = toast.loading("Deleting document...");

        try {
            await axios.delete("/api/docs", {
                params: { id },
            });

            await fetchDocs();

            toast.success("Document deleted successfully!", {
                id: loadingToast,
            });
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message || "Failed to delete document.",
                {
                    id: loadingToast,
                }
            );
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    return (
        <div className="">
            <div
                {...getRootProps()}
                className="border-2 border-gray-400 text-gray-600 border-dashed rounded-xl p-12 text-center cursor-pointer"
            >
                <input {...getInputProps()} />

                <p>Drag & Drop documents here</p>

                <p>or <span className="text-blue-600 hover:underline">Click to Upload</span></p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {docs.map((doc) => (
                    <div
                        key={doc._id}
                        className="group relative rounded-xl border border-gray-300 overflow-hidden mt-4"
                    >
                        {doc.fileType.startsWith("image") ? (
                            <img
                                src={doc.docUrl}
                                className="h-40 w-full object-cover"
                            />
                        ) : (
                            <div className="h-40 flex items-center justify-center text-6xl">
                                {doc.fileType.includes("excel") ? (
                                    <FaFileExcel />
                                ) : doc.fileType.includes("pdf") ? (
                                    <FaFileAlt />
                                ) : (
                                    <FaFileImage />
                                )}
                            </div>
                        )}

                        <div className="p-2 text-sm truncate border-t border-gray-300">
                            {doc.fileName}
                        </div>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-5">
                            <a
                                href={doc.docUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white rounded-full p-3"
                            >
                                <FaEye />
                            </a>

                            <button
                                onClick={() => deleteDoc(doc._id)}
                                className="bg-red-500 text-white rounded-full p-3"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}