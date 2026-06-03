import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function WebpageImage({ section, form, setForm }) {
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (section === "hero") setPreview(form.hero.image);
        else if (section === "about") setPreview(form.about.image);
        else if (section === "faqSection") setPreview(form.faqSection.image);
        else setPreview("");
    }, [form, section]);

    const handleImageChange = (e, section) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        setForm((prev) => {
            if (section === "hero") {
                return {
                    ...prev,
                    hero: { ...prev.hero, image: previewUrl, file },
                };
            }

            if (section === "about") {
                return {
                    ...prev,
                    about: { ...prev.about, image: previewUrl, file },
                };
            }

            if (section === "faqSection") {
                return {
                    ...prev,
                    faqSection: {
                        ...prev.faqSection,
                        image: previewUrl,
                        file,
                    },
                };
            }

            return prev;
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4 h-fit">
            <div className="w-full h-52 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">

                {preview ? (
                    <img
                        src={preview}
                        alt="preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                )}

                <label className="absolute bottom-2 right-2 rounded-full p-2 bg-[#0a5183] hover:bg-[#074977] text-white cursor-pointer">
                    <Plus size={18} />
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, section)}
                    />
                </label>
            </div>
        </div>
    );
}