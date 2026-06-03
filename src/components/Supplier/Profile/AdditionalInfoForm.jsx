"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IdCard } from "lucide-react";

export default function AdditionalInfoForm({ user }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    panNumber: "",
    aadhaarNumber: "",
    tanNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/profile/additional", {
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
    if (user?._id) fetchData();
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/api/profile/additional", form, {
        headers: { "x-user-id": user?._id, },
      });
      toast.success("Details saved");
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Input label="PAN Number" name="panNumber" value={form.panNumber} onChange={handleChange} />

      <Input label="Aadhaar Number" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} />

      <Input label="TAN Number" name="tanNumber" value={form.tanNumber} onChange={handleChange} />

      <div className="flex items-end justify-end">
        <button onClick={handleSubmit} disabled={loading}
          className="px-4 py-2 rounded-md text-white bg-[#0a5183] hover:bg-[#074977]"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

/* Input */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <IdCard size={18} className="icon" />
        <input className="input !pl-8" {...props} placeholder={label} />
      </div>
    </div>
  );
}