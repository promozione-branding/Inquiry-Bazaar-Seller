"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Smartphone } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { sendFirebaseOtp, verifyFirebaseOtp, } from "@/utils/firebaseOtp";

export default function LoginPage() {
    const [otpMode, setOtpMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
        phoneNumber: "",
        otp: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (otpMode) {
            return toast.success("Only Login with Password Working");
        }

        try {
            const res = await axios.post("/api/auth/login", form);
            const data = res.data;

            if (data.success) {
                toast.success("Login Successful");

                const res1 = await fetch("/api/auth/me");
                const data1 = await res1.json();

                if (data1.user) {
                    dispatch(setUser(data1.user));
                    router.push(`/profile`);
                }
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        }
    };

    // SEND OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        try {
            setOtpLoading(true);
            const phone = `+91${form.phoneNumber}`;
            const res = await sendFirebaseOtp(phone, "recaptcha-container");

            if (res.success) {
                toast.success("OTP Sent Successfully");
                setOtpSent(true);
            } else {
                toast.error("Failed To Send OTP");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        } finally {
            setOtpLoading(false);
        }
    };

    // VERIFY OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            setOtpLoading(true);

            const res = await verifyFirebaseOtp(form.otp);
            if (res.success) {
                toast.success("Login Successful");
                const firebaseUser = res.user;
                console.log(firebaseUser);

                const response = await axios.post("/api/auth/otp-login", {
                    phoneNumber: form.phoneNumber,
                });

                if (response.data.success) {
                    dispatch(setUser(response.data.user));
                    router.push(`/${response.data.user.role}/dashboard`);
                }

            } else {
                toast.error("Invalid OTP");
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "OTP Verification Failed");
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#1e3a5f] via-[#27496d] to-[#f45a06] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:flex flex-col justify-center items-center bg-[#1e3a5f] text-white p-10 relative">
                    <div className="absolute inset-0 bg-linear-to-br from-[#1e3a5f] to-[#16314f] opacity-95"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Image
                            src="/Logo/logoo.webp"
                            alt="Logo"
                            width={140}
                            height={140}
                            className="mb-6 drop-shadow-xl h-40 w-auto"
                        />

                        <h1 className="text-4xl font-bold mb-4 text-center">
                            Welcome Back
                        </h1>

                        <p className="text-gray-300 text-center leading-relaxed max-w-sm">
                            Sign in to continue accessing your dashboard and
                            manage everything seamlessly.
                        </p>
                    </div>
                </div>

                <div className="p-4 md:p-8 bg-white">
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
                        Sign In
                    </h2>

                    <p className="text-center text-gray-500 mb-8">
                        Access your account securely
                    </p>

                    <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                        <button onClick={() => { setOtpMode(false); setForm({ email: "", password: "" }) }} className={`w-1/2 py-3 rounded-lg font-medium transition-all duration-300 
                                ${!otpMode ? "bg-[#f45a06] text-white shadow-md" : "text-[#1e3a5f]"}`}>
                            Password Login
                        </button>

                        <button onClick={() => { setOtpMode(true); setForm({ email: "", password: "" }) }}
                            className={`w-1/2 py-3 rounded-lg font-medium transition-all duration-300 
                                ${otpMode ? "bg-[#f45a06] text-white shadow-md" : "text-[#1e3a5f]"}`}>
                            OTP Login
                        </button>
                    </div>

                    {!otpMode ? (<>
                        <form onSubmit={onSubmit} className="space-y-5 text-black">
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    value={form?.email}
                                    onChange={handleChange}
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl transition-all"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    name="password"
                                    value={form?.password}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 pr-12 p-3 rounded-xl transition-all"
                                    required
                                />

                                {/* Eye Button */}
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-[#1e3a5f] hover:text-[#f45a06] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <Link href="/forgot-password"
                                    className="text-sm text-[#f45a06] hover:underline font-medium"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit"
                                className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Sign In
                            </button>
                        </form>
                    </>) : (<>
                        <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-5 text-black">
                            <div className="relative">
                                <Smartphone
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    type="text"
                                    name="phoneNumber"
                                    placeholder="Enter Phone Number"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl transition-all"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock
                                    className="absolute left-4 top-3.5 text-[#1e3a5f]"
                                    size={20}
                                />

                                <input
                                    name="otp"
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Enter OTP"
                                    className="w-full border border-gray-300 focus:border-[#f45a06] focus:ring-2 focus:ring-[#f45a06]/20 outline-none pl-12 p-3 rounded-xl transition-all"
                                />
                            </div>

                            <div className="flex justify-end">
                                <Link href="/forgot-password"
                                    className="text-sm text-[#f45a06] hover:underline font-medium"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button type="submit" disabled={otpLoading}
                                className="w-full bg-[#f45a06] hover:bg-[#d94d04] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {otpLoading ? "Please Wait..." : otpSent ? "Verify OTP" : "Send OTP"}
                            </button>
                        </form>
                    </>)}
                </div>
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
}