"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
    Package,
    Tag,
    Layers,
    IndianRupee,
    List,
    FileText,
    Truck,
    CreditCard,
    IdCard, X,
    Youtube
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import SelectInput from "@/components/Inputs/SelectInput";
import Input from "@/components/Inputs/FormInput";
import SearchableSelect from "@/components/Inputs/SearchInput";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ProductForm({ activeTab, form, setForm }) {
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const getMainCategories = async () => {
        const res = await axios.get("/api/category?type=main");
        setMainCategories(res.data.data);
    };

    const getSubCategories = async (parentId) => {
        if (!parentId) return setSubCategories([]);

        const res = await axios.get(`/api/category?parentId=${parentId}`);
        setSubCategories(res.data.data);
    };

    useEffect(() => {
        getMainCategories();
    }, []);

    useEffect(() => {
        getSubCategories(form.categoryId);
    }, [form.categoryId]);

    // 🔥 Handle Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            {/* 🔹 BASIC */}
            {activeTab === "basic" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Product Name"
                        Icon={Package}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <Input
                        label="Brand Name"
                        Icon={Tag}
                        name="brandName"
                        value={form.brandName}
                        onChange={handleChange}
                    />
                </div>
            )}

            {/* 🔹 CATEGORY */}
            {activeTab === "category" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <SearchableSelect
                        label="Category"
                        value={form.categoryId}
                        onChange={handleChange}
                        options={mainCategories.map((c) => ({
                            label: c.name,
                            value: c._id,
                        }))}
                    />

                    <SelectInput
                        label="Sub Category"
                        Icon={Layers}
                        name="subCategoryId"
                        value={form.subCategoryId}
                        onChange={handleChange}
                        options={subCategories.map((c) => ({
                            label: c.name,
                            value: c._id,
                        }))}
                    />
                </div>
            )}

            {/* 🔹 PRICE */}
            {activeTab === "price" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="New Price"
                        type="number"
                        Icon={IndianRupee}
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                    />

                    <Input
                        label="Old Price"
                        type="number"
                        Icon={IndianRupee}
                        name="oldPrice"
                        value={form.oldPrice}
                        onChange={handleChange}
                    />

                    <SelectInput
                        label="Unit"
                        Icon={List}
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        options={[
                            { label: "Piece", value: "Piece" },
                            { label: "Pair", value: "Pair" },
                            { label: "Jar", value: "Jar" },
                            { label: "Bottle", value: "Bottle" },
                            { label: "Set", value: "Set" },
                            { label: "Bag", value: "Bag" },
                            { label: "Inch", value: "Inch" },
                            { label: "Square ft.", value: "Square ft." },
                            { label: "Square mt.", value: "Square mt." },
                            { label: "Kg", value: "Kg" },
                            { label: "Gram", value: "Gram" },
                            { label: "Meter", value: "Meter" },
                            { label: "Litre", value: "Litre" },
                            { label: "Roll", value: "Roll" },
                            { label: "Pack", value: "Pack" },
                            { label: "Ton", value: "Ton" },
                            { label: "Box", value: "Box" },
                        ]}
                    />

                    <SelectInput
                        label="Price Type"
                        Icon={List}
                        name="priceType"
                        value={form.priceType}
                        onChange={handleChange}
                        options={[
                            { label: "Fixed", value: "fixed" },
                            { label: "Starting", value: "starting" },
                            { label: "On Request", value: "on_request" },
                        ]}
                    />

                    <Input
                        label="Minimum Order Quantity"
                        type="number"
                        Icon={Package}
                        name="minOrderQty"
                        value={form.minOrderQty}
                        onChange={handleChange}
                    />
                </div>
            )}

            {/* 🔹 DESCRIPTION */}
            {activeTab === "description" && (
                <div>
                    <label className="label mb-2">Description</label>

                    <JoditEditor
                        value={form.description}
                        onBlur={(val) =>
                            setForm((prev) => ({ ...prev, description: val }))
                        }
                        config={{
                            height: 300,
                            placeholder: "Write product description...",
                        }}
                    />
                </div>
            )}

            {/* 🔹 SPECIFICATIONS */}
            {activeTab === "specifications" && (
                <Specifications form={form} setForm={setForm} />
            )}

            {/* 🔹 OTHER */}
            {activeTab === "other" && (
                <div className="grid md:grid-cols-2 gap-4">
                    <Input
                        label="Delivery Time"
                        Icon={Truck}
                        name="deliveryTime"
                        value={form.deliveryTime}
                        onChange={handleChange}
                    />

                    <Input
                        label="Payment Terms"
                        Icon={CreditCard}
                        name="paymentTerms"
                        value={form.paymentTerms}
                        onChange={handleChange}
                    />

                    <Input
                        label="Packaging Details"
                        Icon={Package}
                        name="packagingDetails"
                        value={form.packagingDetails}
                        onChange={handleChange}
                    />

                    <Input
                        label="Supply Ability"
                        Icon={Layers}
                        name="supplyAbility"
                        value={form.supplyAbility}
                        onChange={handleChange}
                    />

                    <Input
                        label="YouTube Link"
                        Icon={Youtube}
                        name="youtubeLink"
                        value={form.youtubeLink}
                        onChange={handleChange}
                    />

                    {/* <Input
                        label="Meta Description"
                        Icon={FileText}
                        name="metaDescription"
                        value={form.metaDescription}
                        onChange={handleChange}
                    /> */}
                </div>
            )}
        </>
    );
}

function Specifications({ form, setForm }) {

    const handleSpecChange = (index, field, value) => {
        const updated = [...form.specifications];
        updated[index][field] = value;

        setForm((prev) => ({
            ...prev,
            specifications: updated,
        }));
    };

    const addSpec = () => {
        const last = form.specifications[form.specifications.length - 1];
        if (last && (!last.key || !last.value)) {
            toast.error("Please fill current specification first");
            return;
        }

        setForm((prev) => ({
            ...prev,
            specifications: [
                ...prev.specifications,
                { key: "", value: "" },
            ],
        }));
    };

    const removeSpec = (index) => {
        const updated = form.specifications.filter((_, i) => i !== index);

        setForm((prev) => ({
            ...prev,
            specifications: updated,
        }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800 text-base">
                    Specifications
                </p>

                <button onClick={addSpec} className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition">
                    + Add
                </button>
            </div>

            {form.specifications.length === 0 && (
                <div className="text-sm text-gray-400 mb-3">
                    No specifications added
                </div>
            )}

            <div className="space-y-3">
                {form.specifications.map((spec, index) => {
                    return (
                        <div key={index} className="grid md:grid-cols-2 gap-3 items-start">
                            <div>
                                <Input
                                    label="Key (e.g. Material)"
                                    value={spec.key}
                                    onChange={(e) =>
                                        handleSpecChange(index, "key", e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <Input
                                        label="Value (e.g. Steel)"
                                        value={spec.value}
                                        onChange={(e) =>
                                            handleSpecChange(index, "value", e.target.value)
                                        }
                                    />
                                </div>

                                {/* REMOVE BUTTON */}
                                <button
                                    onClick={() => removeSpec(index)}
                                    className="mb-1 p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>);
                })}
            </div>
        </div>
    );
}