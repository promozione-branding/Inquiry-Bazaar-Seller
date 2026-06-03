'use client'
import React, { useEffect, useState } from 'react'
import {
    Home,
    Info,
    Briefcase,
    Rocket,
    HelpCircle,
    Mail,
    Plus,
} from "lucide-react";
import WebpageImage from '@/components/Supplier/Webpage/WebpageImage';
import WebpageForm from '@/components/Supplier/Webpage/WebpageForm';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axios from 'axios';

const sectionItems = [
    { name: "Hero Section", key: "hero", icon: Home, color: "bg-blue-100 text-blue-600" },
    { name: "About Us", key: "about", icon: Info, color: "bg-green-100 text-green-600" },
    { name: "Work Details", key: "work", icon: Briefcase, color: "bg-yellow-100 text-yellow-600" },
    { name: "CTA", key: "cta", icon: Rocket, color: "bg-purple-100 text-purple-600" },
    { name: "FAQ", key: "faqSection", icon: HelpCircle, color: "bg-pink-100 text-pink-600" },
];

export default function Website() {
    const { user } = useSelector((state) => state.auth);
    const [section, setSection] = useState("hero")
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        userId: "",

        hero: {
            color: "#ff0000",
            heading: "",
            subHeading: "",
            image: "",      // preview OR saved URL
            file: null,     // ✅ actual file
        },

        about: {
            heading: "",
            subHeading: "",
            description: "",
            image: "",
            file: null,     // ✅
        },

        work: {
            experience: "",
            clients: "",
            projects: "",
            awards: "",
        },

        cta: {
            heading: "",
            subHeading: "",
        },

        faqSection: {
            image: "",
            file: null,     // ✅
            faqs: [],
        }
    });

    const handleChange = (section, field, value) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleSave = async () => {
        if (saving) return;

        if (!user?._id) {
            return toast.error("User not found");
        }

        setSaving(true);

        const saveWebpage = async () => {
            const formData = new FormData();

            formData.append("userId", user._id);

            // ❗ Remove file before sending JSON
            const hero = { ...form.hero };
            const about = { ...form.about };
            const faqSection = { ...form.faqSection };

            delete hero.file;
            delete about.file;
            delete faqSection.file;

            formData.append("hero", JSON.stringify(hero));
            formData.append("about", JSON.stringify(about));
            formData.append("work", JSON.stringify(form.work));
            formData.append("cta", JSON.stringify(form.cta));
            formData.append("faqSection", JSON.stringify(faqSection));

            // ✅ Files
            if (form.hero.file) formData.append("heroImage", form.hero.file);
            if (form.about.file) formData.append("aboutImage", form.about.file);
            if (form.faqSection.file) formData.append("faqImage", form.faqSection.file);

            const res = await axios.post("/api/webpage", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        };

        try {
            await toast.promise(saveWebpage(), {
                loading: "Saving webpage...",
                success: "Webpage saved successfully!",
                error: (err) =>
                    err?.response?.data?.message || err.message || "Failed to save webpage",
            });
        } finally {
            setSaving(false);
        }
    };

    const getWebpage = async (userId) => {
        if (!userId) return;

        try {
            const res = await axios.get(`/api/webpage/${userId}`);
            return res.data;
        } catch (err) {
            console.error(err);
            toast.error(
                err?.response?.data?.message || "Failed to fetch webpage"
            );
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getWebpage(user?._id);

            if (data) {
                setForm({
                    userId: data.userId || "",

                    hero: {
                        ...data.hero,
                        file: null, // reset file
                    },

                    about: {
                        ...data.about,
                        file: null,
                    },

                    work: data.work || {},

                    cta: data.cta || {},

                    faqSection: {
                        ...data.faqSection,
                        file: null,
                    },
                });
            }
        };

        if (user?._id) fetchData();
    }, [user]);

    return (<>
        <div className="py-6 px-4 w-full bg-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {sectionItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} onClick={() => setSection(item.key)}
                            className="h-46 flex flex-col items-center justify-center p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:scale-105"
                        >
                            <div className={`p-4 rounded-full mb-3 ${item.color}`}>
                                <Icon size={28} />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 text-center">
                                {item.name}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className='mt-5 grid lg:grid-cols-3 gap-5'>
                <WebpageImage
                    section={section}
                    setForm={setForm}
                    form={form}
                />

                <WebpageForm
                    saving={saving}
                    section={section}
                    setForm={setForm}
                    form={form}
                    handleChange={handleChange}
                    handleSave={handleSave}
                />
            </div>
        </div>
    </>)
}
