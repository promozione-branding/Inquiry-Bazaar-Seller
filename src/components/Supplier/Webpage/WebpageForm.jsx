"use client"
import Input from '@/components/Inputs/FormInput'
import { Award, Briefcase, Heading1, Heading6, Package, Palette, Timer, Users, X } from 'lucide-react'
import React, { useState } from 'react'
import dynamic from "next/dynamic";
import SelectInput from '@/components/Inputs/SelectInput';
import toast from 'react-hot-toast';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function WebpageForm({ saving, section, form, setForm, handleChange, handleSave }) {

    const hexToRgba = (hex) => {
        let r = 0, g = 0, b = 0;

        if (hex?.length === 7) {
            r = parseInt(hex?.slice(1, 3), 16);
            g = parseInt(hex?.slice(3, 5), 16);
            b = parseInt(hex?.slice(5, 7), 16);
        }

        return `rgba(${r}, ${g}, ${b}, 1)`;
    };
    const rgbaColor = hexToRgba(form.hero.color);

    return (
        <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="grid md:grid-cols-2 gap-4">
                    {section == "hero" && <>
                        <div className="">
                            <label className="label">Color</label>
                            <div className="relative flex items-center gap-2">
                                <Palette size={18} className="icon left-14!" />

                                <input
                                    type="color"
                                    value={form.hero.color}
                                    onChange={(e) => handleChange("hero", "color", e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer"
                                />

                                <input
                                    type="text"
                                    value={rgbaColor}
                                    // value={form.hero.color}
                                    readOnly
                                    className="input pl-8! flex-1"
                                />
                            </div>
                        </div>

                        <Input
                            label="Hero Section Heading"
                            Icon={Heading1}
                            name="name"
                            value={form.hero.heading}
                            onChange={(e) => handleChange("hero", "heading", e.target.value)}
                        />

                        <Input
                            label="Hero Section Sub Heading"
                            Icon={Heading6}
                            name="name"
                            value={form.hero.subHeading}
                            onChange={(e) => handleChange("hero", "subHeading", e.target.value)}
                        />
                    </>}

                    {section == "about" && <>
                        <SelectInput
                            label="About Us Heading"
                            Icon={Heading1}
                            value={form.about.heading}
                            onChange={(e) => handleChange("about", "heading", e.target.value)}
                            options={[
                                { label: "About us", value: "About us" },
                                { label: "Intro", value: "Intro" },
                                { label: "Know us", value: "Know us" },
                                { label: "Who we are", value: "Who we are" },
                            ]}
                        />

                        <Input
                            label="About Us Sub Heading"
                            Icon={Heading6}
                            name="name"
                            value={form.about.subHeading}
                            onChange={(e) => handleChange("about", "subHeading", e.target.value)}
                        />

                        <div className='md:col-span-2'>
                            <label className="label mb-2">Description</label>

                            <JoditEditor
                                value={form.about.description}
                                onChange={(val) =>
                                    handleChange("about", "description", val)
                                }
                                config={{
                                    height: 300,
                                    placeholder: "Write About us description...",
                                }}
                            />
                        </div>
                    </>}

                    {section == "work" && <>
                        <Input
                            label="Experience"
                            Icon={Timer}
                            value={form.work.experience}
                            onChange={(e) => handleChange("work", "experience", e.target.value)}
                        />

                        <Input
                            label="Clients"
                            Icon={Users}
                            value={form.work.clients}
                            onChange={(e) => handleChange("work", "clients", e.target.value)}
                        />

                        <Input
                            label="Projects"
                            Icon={Briefcase}
                            value={form.work.projects}
                            onChange={(e) => handleChange("work", "projects", e.target.value)}
                        />

                        <Input
                            label="Awards"
                            Icon={Award}
                            value={form.work.awards}
                            onChange={(e) => handleChange("work", "awards", e.target.value)}
                        />
                    </>}

                    {section == "cta" && <>
                        <Input
                            label="CTA Heading"
                            Icon={Heading1}
                            value={form.cta.heading}
                            onChange={(e) => handleChange("cta", "heading", e.target.value)}
                        />

                        <Input
                            label="CTA Sub Heading"
                            Icon={Heading6}
                            value={form.cta.subHeading}
                            onChange={(e) => handleChange("cta", "subHeading", e.target.value)}
                        />
                    </>}

                    {section == "faqSection" && <div className='md:col-span-2'>
                        <FAQSection form={form} setForm={setForm} />
                    </div>}
                </div>

                <div className="flex justify-between items-center gap-3 mt-6">
                    <div className="items-center">
                        <span className='text-blue-600 hover:underline cursor-pointer'>
                            Need help?
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2 rounded-lg bg-[#D01132] text-white cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#0a5183] text-white rounded-lg cursor-pointer">
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


function FAQSection({ form, setForm }) {

    const handleFAQChange = (index, field, value) => {
        const updated = [...form.faqSection.faqs];
        updated[index][field] = value;

        setForm((prev) => ({
            ...prev,
            faqSection: {
                ...prev.faqSection,
                faqs: updated,
            },
        }));
    };

    const addFAQ = () => {
        const last = form.faqSection.faqs.at(-1);

        if (last && (!last.question || !last.answer)) {
            toast.error("Please fill current FAQ first");
            return;
        }

        setForm((prev) => ({
            ...prev,
            faqSection: {
                ...prev.faqSection,
                faqs: [
                    ...prev.faqSection.faqs,
                    { question: "", answer: "" },
                ],
            },
        }));
    };

    const removeFAQ = (index) => {
        const updated = form.faqSection.faqs.filter((_, i) => i !== index);

        setForm((prev) => ({
            ...prev,
            faqSection: {
                ...prev.faqSection,
                faqs: updated,
            },
        }));
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800 text-base">
                    FAQs
                </p>

                <button
                    onClick={addFAQ}
                    className="text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg transition"
                >
                    + Add
                </button>
            </div>

            {/* Empty State */}
            {form.faqSection.faqs.length === 0 && (
                <div className="text-sm text-gray-400 mb-3">
                    No FAQs added
                </div>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
                {form.faqSection.faqs.map((faq, index) => (
                    <div key={index} className="grid md:grid-cols-2 gap-5">

                        {/* Question */}
                        <Input
                            label="Question"
                            value={faq.question}
                            onChange={(e) =>
                                handleFAQChange(index, "question", e.target.value)
                            }
                        />

                        {/* Answer + Remove */}
                        <div className="flex gap-2 items-start">
                            <div className="flex-1">
                                <Input
                                    label="Answer"
                                    value={faq.answer}
                                    onChange={(e) =>
                                        handleFAQChange(index, "answer", e.target.value)
                                    }
                                />
                            </div>

                            <button
                                onClick={() => removeFAQ(index)}
                                className="mt-6 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}