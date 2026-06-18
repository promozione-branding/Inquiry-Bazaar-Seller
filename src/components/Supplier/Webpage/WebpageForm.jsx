"use client"
import Input from '@/components/Inputs/FormInput'
import { Award, Briefcase, Heading1, Heading6, Package, Palette, Timer, Users, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import SelectInput from '@/components/Inputs/SelectInput';
import toast from 'react-hot-toast';
import axios from 'axios';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function WebpageForm({ user, saving, section, form, setForm, handleChange, handleSave }) {
    const [products, setProducts] = useState([]);
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

    const getProducts = async () => {
        try {
            // setLoading(true);
            const res = await axios.get(`/api/product?supplierId=${user._id}`);
            // console.log(res)
            setProducts(res.data.data);
        } catch (err) {
            console.log("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        if (user?._id) {
            getProducts();
        }
    }, [user]);

    const handleProductSelect = (section, values) => {
        const selected = Array.isArray(values) ? values : [values];

        setForm((prev) => {
            const existing = prev?.[section]?.products || [];

            let updated = [...existing];

            selected.forEach((id) => {
                if (!updated.includes(id)) {
                    updated.push(id);
                }
            });

            if (updated.length > 6) {
                toast.error("Maximum 6 products allowed");
                updated = updated.slice(0, 6);
            }

            return {
                ...prev,
                [section]: {
                    ...prev[section],
                    products: updated,
                },
            };
        });
    };

    const removeProduct = (section, id) => {
        setForm((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                products: prev[section].products.filter(
                    (p) => p !== id
                ),
            },
        }));
    };

    // console.log(form)

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

                    {section == "product" && <>
                        <Input
                            label="Featured Products Section Heading"
                            Icon={Heading1}
                            name="name"
                            value={form?.featuredProducts?.heading}
                            onChange={(e) => handleChange("featuredProducts", "heading", e.target.value)}
                        />

                        <Input
                            label="Featured Products Section Sub Heading"
                            Icon={Heading6}
                            name="name"
                            value={form?.featuredProducts?.subHeading}
                            onChange={(e) => handleChange("featuredProducts", "subHeading", e.target.value)}
                        />

                        <SelectInput
                            label="Select Featured Products"
                            Icon={Heading1}
                            multiple
                            value=""
                            onChange={(e) => {
                                const selected = Array.from(
                                    e.target.selectedOptions
                                ).map((o) => o.value);

                                handleProductSelect(
                                    "featuredProducts",
                                    selected
                                );
                            }}
                            options={products.map((p) => ({
                                label: p.name,
                                value: p._id,
                            }))}
                        />

                        <div className="md:col-span-2 mt-3 flex flex-wrap gap-2">
                            {form.featuredProducts?.products?.map((id) => {
                                const product = products.find((p) => p._id === id);
                                return (
                                    <div key={id}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-300"
                                    >
                                        <Package size={14} />

                                        <span>
                                            {product?.name}
                                        </span>

                                        <button type="button" onClick={() => removeProduct("featuredProducts", id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <Input
                            label="Popular Products Section Heading"
                            Icon={Heading1}
                            name="name"
                            value={form?.popularProducts?.heading}
                            onChange={(e) => handleChange("popularProducts", "heading", e.target.value)}
                        />

                        <Input
                            label="Popular Products Section Sub Heading"
                            Icon={Heading6}
                            name="name"
                            value={form?.popularProducts?.subHeading}
                            onChange={(e) => handleChange("popularProducts", "subHeading", e.target.value)}
                        />

                        <div>
                            <label className="label">
                                Select Popular Products
                            </label>

                            <div className="relative">
                                <Heading1
                                    size={18}
                                    className="icon"
                                />

                                <select
                                    multiple
                                    className="input pl-8! p-2.5! h-[100px]"
                                    value={[]}
                                    onChange={(e) => {
                                        const selected = Array.from(
                                            e.target.selectedOptions
                                        ).map((o) => o.value);

                                        handleProductSelect(
                                            "popularProducts",
                                            selected
                                        );
                                    }}
                                >
                                    {products.map((p) => (
                                        <option
                                            key={p._id}
                                            value={p._id}
                                        >
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2 mt-3 flex flex-wrap gap-2">
                            {form.popularProducts?.products?.map((id) => {
                                const product = products.find((p) => p._id === id);
                                return (
                                    <div key={id}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-300"
                                    >
                                        <Package size={14} />

                                        <span>
                                            {product?.name}
                                        </span>

                                        <button type="button" onClick={() => removeProduct("popularProducts", id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
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