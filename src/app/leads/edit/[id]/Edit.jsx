"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "@/components/Inputs/FormInput";
import SelectInput from "@/components/Inputs/SelectInput";
import {
    ArrowLeft,
    Save,
    User,
    Phone,
    Mail,
    Building2,
    ReceiptText,
    MapPin,
    Package,
    Megaphone,
    Target,
    DollarSign,
    CalendarDays,
    Tag,
    MessageSquare,
    FileText,
    Trash2,
} from "lucide-react";

const initialFormData = {
    name: "",
    phone: "",
    email: "",
    companyName: "",
    gstNumber: "",
    place: "",
    product: "",
    source: "manual",

    priceRange: "",
    dealValue: "",
    expectedClosureDate: "",
    stage: "new",
    status: "open",

    message: "",
    remark: "",

    campaignId: "",
    campaignName: "",
};

export default function Edit() {
    const router = useRouter();
    const params = useParams();
    const leadId = params?.id;
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!leadId) return;

        const fetchLead = async () => {
            try {
                setLoading(true);

                const response = await axios.get(`/api/leads/${leadId}`);

                const lead = response.data?.lead || response.data;

                if (!lead) {
                    throw new Error("Lead not found");
                }

                setFormData({
                    name: lead.name || "",
                    phone: lead.phone || "",
                    email: lead.email || "",
                    companyName: lead.companyName || "",
                    gstNumber: lead.gstNumber || "",
                    place: lead.place || "",
                    product: lead.product || "",
                    source: lead.source || "manual",

                    priceRange:
                        lead.priceRange !== null &&
                            lead.priceRange !== undefined
                            ? String(lead.priceRange)
                            : "",

                    dealValue:
                        lead.dealValue !== null &&
                            lead.dealValue !== undefined
                            ? String(lead.dealValue)
                            : "",

                    expectedClosureDate: lead.expectedClosureDate
                        ? new Date(lead.expectedClosureDate)
                            .toISOString()
                            .split("T")[0]
                        : "",

                    stage: lead.stage || "new",
                    status: lead.status || "open",

                    message: lead.message || "",
                    remark: lead.remark || "",

                    campaignId: lead.campaignId || "",
                    campaignName: lead.campaignName || "",
                });
            } catch (error) {
                console.error("Fetch lead error:", error);

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to load lead"
                );

                router.push("/leads");
            } finally {
                setLoading(false);
            }
        };

        fetchLead();
    }, [leadId, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Lead name is required");
            return;
        }

        try {
            setSaving(true);

            await axios.put(`/api/leads/${leadId}`, {
                ...formData,

                priceRange:
                    formData.priceRange === ""
                        ? null
                        : Number(formData.priceRange),

                dealValue:
                    formData.dealValue === ""
                        ? null
                        : Number(formData.dealValue),

                expectedClosureDate:
                    formData.expectedClosureDate || null,
            });

            toast.success("Lead updated successfully");

            router.push("/leads");
            router.refresh();
        } catch (error) {
            console.error("Update lead error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to update lead"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this lead? This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await axios.delete(`/api/leads/${leadId}`);

            toast.success("Lead deleted successfully");

            router.push("/leads");
            router.refresh();
        } catch (error) {
            console.error("Delete lead error:", error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to delete lead"
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <main className="w-full min-w-0 px-2 sm:px-4 md:px-6 py-4 md:py-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                    <div className="flex items-center justify-center min-h-[300px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#074977] rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">
                                Loading lead...
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full min-w-0 px-2 sm:px-4 md:px-6 py-4 md:py-6">
            <div className="sticky top-20 z-40 mb-5">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-3 sm:px-4 py-3">
                    <div className="flex items-center justify-between gap-3">

                        {/* LEFT */}
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                                    Edit Lead
                                </h1>

                                <p className="hidden sm:block text-xs text-gray-500 mt-0.5 truncate">
                                    Update lead information
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* DELETE */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash2 size={16} />

                                <span className="hidden sm:inline">
                                    {deleting ? "Deleting..." : "Delete"}
                                </span>
                            </button>

                            {/* CANCEL */}
                            <button
                                type="button"
                                onClick={() => router.back()}
                                disabled={saving || deleting}
                                className="h-9 sm:h-10 px-3 sm:px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            {/* SAVE */}
                            <button
                                type="submit"
                                form="edit-lead-form"
                                disabled={saving || deleting}
                                className="h-9 sm:h-10 px-3 sm:px-5 rounded-lg bg-[#074977] text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60"
                            >
                                <Save size={16} />

                                <span>
                                    {saving ? "Updating..." : "Update Lead"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <form
                id="edit-lead-form"
                onSubmit={handleSubmit}
                className="w-full"
            >
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                    {/* ========================================
              LEAD INFORMATION
          ======================================== */}
                    <section className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#074977] flex items-center justify-center shrink-0">
                                <User size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Lead Information
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Basic information about the customer
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            <Input
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                Icon={User}
                            />

                            <Input
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                Icon={Phone}
                            />

                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                Icon={Mail}
                            />

                            <Input
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                Icon={Building2}
                            />

                            <Input
                                label="GST Number"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                Icon={ReceiptText}
                            />

                            <Input
                                label="Place"
                                name="place"
                                value={formData.place}
                                onChange={handleChange}
                                Icon={MapPin}
                            />

                            <Input
                                label="Product"
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                Icon={Package}
                            />

                            <SelectInput
                                label="Lead Source"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                                Icon={Megaphone}
                                options={[
                                    { value: "facebook", label: "Facebook" },
                                    { value: "google", label: "Google" },
                                    { value: "website", label: "Website" },
                                    { value: "whatsapp", label: "WhatsApp" },
                                    { value: "manual", label: "Manual" },
                                    { value: "indiamart", label: "IndiaMART" },
                                    { value: "tradeindia", label: "TradeIndia" },
                                    { value: "other", label: "Other" },
                                ]}
                            />

                        </div>
                    </section>

                    <div className="border-t border-gray-100" />

                    {/* ========================================
              LEAD DETAILS
          ======================================== */}
                    <section className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                <Target size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Lead Details
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Deal, stage and closure information
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            <Input
                                label="Price Range"
                                name="priceRange"
                                type="number"
                                min="0"
                                value={formData.priceRange}
                                onChange={handleChange}
                                Icon={DollarSign}
                            />

                            <Input
                                label="Deal Value"
                                name="dealValue"
                                type="number"
                                min="0"
                                value={formData.dealValue}
                                onChange={handleChange}
                                Icon={DollarSign}
                            />

                            <div>
                                <label className="label">
                                    Expected Closure Date
                                </label>

                                <div className="relative">
                                    <CalendarDays
                                        size={18}
                                        className="icon"
                                    />

                                    <input
                                        type="date"
                                        name="expectedClosureDate"
                                        value={formData.expectedClosureDate}
                                        onChange={handleChange}
                                        className="input pl-8! w-full"
                                    />
                                </div>
                            </div>

                            <SelectInput
                                label="Stage"
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                Icon={Tag}
                                options={[
                                    { value: "new", label: "New" },
                                    { value: "contacted", label: "Contacted" },
                                    { value: "qualified", label: "Qualified" },
                                    {
                                        value: "proposal_sent",
                                        label: "Proposal Sent",
                                    },
                                    {
                                        value: "negotiation",
                                        label: "Negotiation",
                                    },
                                    { value: "won", label: "Won" },
                                    { value: "lost", label: "Lost" },
                                ]}
                            />

                            <SelectInput
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                Icon={Target}
                                options={[
                                    { value: "open", label: "Open" },
                                    { value: "closed", label: "Closed" },
                                    { value: "junk", label: "Junk" },
                                ]}
                            />

                        </div>
                    </section>

                    <div className="border-t border-gray-100" />

                    {/* ========================================
              COMMUNICATION
          ======================================== */}
                    <section className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <MessageSquare size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Communication
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Customer message and internal remarks
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="label">
                                    Message
                                </label>

                                <div className="relative">
                                    <MessageSquare
                                        size={18}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />

                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Customer message"
                                        rows={4}
                                        className="input pl-9! pt-2.5! w-full resize-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    Remark
                                </label>

                                <div className="relative">
                                    <FileText
                                        size={18}
                                        className="absolute left-3 top-3 text-gray-400"
                                    />

                                    <textarea
                                        name="remark"
                                        value={formData.remark}
                                        onChange={handleChange}
                                        placeholder="Add internal remark..."
                                        rows={4}
                                        className="input pl-9! pt-2.5! w-full resize-none"
                                    />
                                </div>
                            </div>

                        </div>
                    </section>

                    <div className="border-t border-gray-100" />

                    {/* ========================================
              CAMPAIGN
          ======================================== */}
                    <section className="p-4 md:p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <Megaphone size={17} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-gray-800">
                                    Campaign
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Optional campaign information
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <Input
                                label="Campaign ID"
                                name="campaignId"
                                value={formData.campaignId}
                                onChange={handleChange}
                                Icon={Tag}
                            />

                            <Input
                                label="Campaign Name"
                                name="campaignName"
                                value={formData.campaignName}
                                onChange={handleChange}
                                Icon={Megaphone}
                            />

                        </div>
                    </section>

                </div>
            </form>
        </main>
    );
}