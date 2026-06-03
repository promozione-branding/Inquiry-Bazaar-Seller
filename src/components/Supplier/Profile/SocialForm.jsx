"use client";
import React, { useEffect, useState } from "react";
import {
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Send, // telegram
    MessageCircle, // whatsapp
    Twitter, // X
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function SocialForm({ user }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        whatsapp: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        telegram: "",
        youtube: "",
        twitter: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveSocial = async () => {
        try {
            setLoading(true);
            await axios.post("/api/profile/social", form, {
                headers: { "x-user-id": user?._id, },
            });

            toast.success("Social links saved");
        } catch (err) {
            toast.error("Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const fetchSocial = async () => {
        try {
            const res = await axios.get("/api/profile/social", {
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
        if (user?._id) {
            fetchSocial();
        }
    }, [user]);

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <SocialInput
                label="WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                icon={<MessageCircle size={18} />}
                placeholder="https://wa.me/91xxxxxxxxxx"
            />

            <SocialInput
                label="LinkedIn"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                icon={<Linkedin size={18} />}
                placeholder="LinkedIn profile link"
            />

            <SocialInput
                label="Instagram"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                icon={<Instagram size={18} />}
                placeholder="Instagram profile"
            />

            <SocialInput
                label="Facebook"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                icon={<Facebook size={18} />}
                placeholder="Facebook page link"
            />

            <SocialInput
                label="Telegram"
                name="telegram"
                value={form.telegram}
                onChange={handleChange}
                icon={<Send size={18} />}
                placeholder="Telegram link"
            />

            <SocialInput
                label="YouTube"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                icon={<Youtube size={18} />}
                placeholder="YouTube channel"
            />

            <SocialInput
                label="X (Twitter)"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                icon={<Twitter size={18} />}
                placeholder="https://x.com/username"
            />

            {/* Save Button */}
            <div className="flex justify-end items-end">
                <button onClick={saveSocial} className="px-4 py-2 rounded-md text-white bg-[#0a5183] hover:bg-[#074977]">
                    Save
                </button>
            </div>
        </div>
    );
}

function SocialInput({ label, icon, type = "text", ...props }) {
    return (
        <div>
            <label className="label">{label}</label>
            <div className="relative">
                <div className="icon">{icon}</div>
                <input type={type} className="input !pl-8" {...props} placeholder={label} />
            </div>
        </div>
    );
}