"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Smartphone,
    ShieldCheck,
    LockKeyhole,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Page() {
    const [step, setStep] = useState(1);

    const [form, setForm] = useState({
        phone: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSendOtp = (e) => {
        e.preventDefault();

        if (!form.phone) {
            return toast.error("Enter phone number");
        }

        toast.success("OTP Sent Successfully");
        setStep(2);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();

        if (!form.otp) {
            return toast.error("Enter OTP");
        }

        toast.success("OTP Verified");
        setStep(3);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        toast.success("Password Reset Successful");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#1e3a5f] via-[#27496d] to-[#f45a06] flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-[#1e3a5f] relative px-8 py-6 text-center">
                    <div className="absolute inset-0 bg-linear-to-br from-[#1e3a5f] to-[#142c47] opacity-95"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Image
                            src="/Logo/logoo.webp"
                            alt="Logo"
                            width={90}
                            height={90}
                            className="mb-4 w-auto"
                        />

                        <h1 className="text-3xl font-bold text-white mb-2">
                            Forgot Password?
                        </h1>

                        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                            Reset your password securely in just a few simple steps.
                        </p>
                    </div>
                </div>

                <div className="p-6 md:p-8 bg-white">
                    <div className="flex items-start justify-between mb-6 relative">
                        {[1, 2, 3].map((item, index) => (
                            <React.Fragment key={item}>
                                <div className="flex flex-col items-center relative z-10">

                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= item
                                                ? "bg-[#f45a06] text-white"
                                                : "bg-gray-200 text-gray-500"
                                            }`}
                                    >
                                        {item}
                                    </div>

                                    <span className="text-[11px] mt-2 text-gray-500 text-center">
                                        {item === 1
                                            ? "Mobile"
                                            : item === 2
                                                ? "OTP"
                                                : "Password"}
                                    </span>
                                </div>

                                {index < 2 && (
                                    <div className="flex-1 flex items-center px-2 mt-5">
                                        <div
                                            className={`h-1 w-full rounded-full transition-all ${step > item
                                                    ? "bg-[#f45a06]"
                                                    : "bg-gray-200"
                                                }`}
                                        ></div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="relative">
                                <Smartphone
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="Enter Mobile Number"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black"
                                    required
                                />
                            </div>

                            <button type="submit"
                                className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                            >
                                Send OTP
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div className="relative">
                                <ShieldCheck
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    type="text"
                                    name="otp"
                                    value={form.otp}
                                    onChange={handleChange}
                                    placeholder="Enter OTP"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black"
                                    required
                                />
                            </div>

                            <button type="submit"
                                className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                            >
                                Verify OTP
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {/* Step 3 */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="relative">
                                <LockKeyhole
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="New Password"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <LockKeyhole
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl text-black"
                                    required
                                />
                            </div>

                            <button type="submit"
                                className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-4 rounded-xl font-semibold transition-all duration-300"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}

                    {/* Bottom */}
                    <p className="text-center text-gray-500 mt-4 text-sm">
                        Remember your password?{" "}
                        <Link href="/login"
                            className="text-[#1e3a5f] font-semibold hover:text-[#f45a06] transition-colors"
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}