"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Building2,
    User,
    Landmark,
} from "lucide-react";

export default function BankForm({ user }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        accountNumber: "",
        accountHolderName: "",
        bankName: "",
        branchName: "",
        ifsc: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchBank = async () => {
        try {
            const res = await axios.get("/api/profile/bank", {
                headers: { "x-user-id": user?._id, },
            });

            if (res.data?.data) {
                setForm(res.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (user?._id) fetchBank();
    }, [user]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await axios.post("/api/profile/bank", form, {
                headers: { "x-user-id": user?._id, },
            });
            toast.success("Bank details saved");
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-4">

            <Input label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} icon={<Landmark size={18} />} />

            <Input label="Account Holder Name" name="accountHolderName" value={form.accountHolderName} onChange={handleChange} icon={<User size={18} />} />

            <Input label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} icon={<Landmark size={18} />} />

            <Input label="Branch Name" name="branchName" value={form.branchName} onChange={handleChange} icon={<Landmark size={18} />} />

            <Input label="IFSC" name="ifsc" value={form.ifsc} onChange={handleChange} icon={<Building2 size={18} />} />

            <div className="flex items-end md:mt-5 justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 rounded-md text-white bg-[#0a5183] hover:bg-[#074977] disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}

/* Reusable Input */
function Input({ label, icon, ...props }) {
    return (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <div className="icon">{icon}</div>
                <input className="input !pl-8" {...props} placeholder={label} />
            </div>
        </div>
    );
}