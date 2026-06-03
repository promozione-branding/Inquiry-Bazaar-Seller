"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function SellerRegister() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/register", { ...form, role: "supplier", });
      // if (res.success) {
      const res1 = await fetch("/api/auth/me");
      const data1 = await res1.json();
      if (data1.user) {
        dispatch(setUser(data1.user));
        toast.success("Registered Successfully");
        router.push("/profile");
      }
      // }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1e3a5f] via-[#27496d] to-[#f45a06] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-center bg-[#1e3a5f] relative p-10 text-white">
          <div className="absolute inset-0 bg-linear-to-br from-[#1e3a5f] to-[#142c47] opacity-95"></div>
          <div className="relative z-10 flex flex-col items-center">
            <Image
              src="/Logo/logoo.webp"
              alt="Logo"
              width={140}
              height={140}
              className="mb-4 w-auto h-30"
            />

            <h1 className="text-4xl font-bold mb-2 text-center">
              Become a Supplier
            </h1>

            <p className="text-gray-300 text-center leading-relaxed max-w-sm">
              Register as a supplier and manage products,
              orders, and business operations with ease.
            </p>

            {/* Features */}
            <div className="mt-4 space-y-4 w-full max-w-xs">
              <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck size={18} />
                Secure Registration
              </div>

              <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck size={18} />
                Supplier Dashboard Access
              </div>

              <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck size={18} />
                Manage Products & Orders
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-10 flex flex-col justify-center">
          <div className="md:hidden flex justify-center mb-4">
            <Image
              src="/Logo/logoo.webp"
              alt="Logo"
              width={90}
              height={90}
              className="w-auto h-30"
            />
          </div>

          <h2 className="text-3xl font-bold text-center text-[#1e3a5f] mb-2">
            Supplier Registration
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Create your supplier account
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name */}
            <div className="relative">
              <User
                className="absolute left-4 top-3.5 text-[#1e3a5f]"
                size={20}
              />

              <input
                name="name"
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black transition-all"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-[#1e3a5f]"
                size={20}
              />

              <input
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black transition-all"
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone
                className="absolute left-4 top-3.5 text-[#1e3a5f]"
                size={20}
              />

              <input
                name="phone"
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-3.5 text-[#1e3a5f]"
                size={20}
              />

              <input
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 pr-12 p-3 rounded-xl text-black transition-all"
                required
              />

              {/* Eye Button */}
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-[#1e3a5f] hover:text-[#f45a06] transition-colors"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <button type="submit"
              className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Register Supplier
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#1e3a5f] font-semibold hover:text-[#f45a06] transition-colors"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}