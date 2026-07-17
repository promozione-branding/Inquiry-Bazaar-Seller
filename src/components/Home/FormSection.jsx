"use client";
import { sendFirebaseOtp, verifyFirebaseOtp } from "@/utils/firebaseOtp";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";

export default function FormSection() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            toast.error("Enter valid mobile number");
            return;
        }

        setLoading(true);
        const res = await sendFirebaseOtp(`+91${phone}`, "recaptcha-container");
        setLoading(false);
        if (res.success) {
            setShowOtp(true);
            toast.success("OTP Sent");
        } else {
            toast.error("Failed to send OTP");
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Enter a valid 6-digit OTP");
            return;
        }
        setLoading(true);
        try {
            const result = await verifyFirebaseOtp(otp);
            if (!result.success) {
                toast.error("Invalid OTP");
                return;
            }

            const { data } = await axios.post("/api/auth/login-with-otp",
                { phone, }, { withCredentials: true, }
            );

            toast.success("Login Successfully");
            const res = await fetch("/api/auth/me");
            const userData = await res.json();

            if (userData.user) {
                dispatch(setUser(userData.user));
                router.push("/profile");
            }
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error) && error.response) {
                const { status, data } = error.response;

                switch (status) {
                    case 404:
                        toast.error(data.message || "User not found");

                        setTimeout(() => {
                            router.push(`/register`);
                        }, 1500);
                        break;

                    case 400:
                        toast.error(data.message || "Invalid request");
                        break;

                    case 401:
                        toast.error("Unauthorized");
                        break;

                    case 500:
                        toast.error("Server error");
                        break;

                    default:
                        toast.error(data.message || "Login failed");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[80vh] md:h-[70vh] bg-cover bg-center bg-no-repeat flex md:items-center items-start"
            style={{ backgroundImage: "url('/banner.webp')", }}>

            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="grid md:grid-cols-2 gap-10 items-center">

                    {/* Left side empty for image visibility */}
                    <div></div>

                    {/* Right Side Form */}
                    <div className="bg-white/95 p-4 md:p-8 rounded-xl shadow-xl">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                            Sell for free
                            <span className="font-normal">
                                {" "}on India's largest online B2B marketplace
                            </span>
                        </h1>

                        <h2 className="text-lg font-semibold mb-2">
                            Free Registration/Sign In
                        </h2>
                        {!showOtp ? (
                            <form onSubmit={sendOtp} className="flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-md bg-white border">
                                <div className="flex items-center w-full py-4">
                                    <div className="flex items-center px-2 md:px-4 border-r border-gray-300">
                                        <span className="text-lg">+91</span>
                                    </div>

                                    <input
                                        type="tel"
                                        maxLength={10}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter 10 digit mobile number"
                                        className="flex-1 px-2 md:px-5 outline-none text-lg"
                                    />
                                </div>

                                <button type="submit" disabled={loading}
                                    className="bg-[#0e2347] text-nowrap hover:opacity-90 text-white font-semibold px-8 py-4 transition"
                                >
                                    {loading ? "Sending..." : " Start Selling →"}
                                </button>
                            </form>)
                            :
                            (<form onSubmit={verifyOtp} className="flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-md bg-white border">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="Enter OTP"
                                    className="flex-1 outline-none p-4 rounded-lg"
                                />

                                <button type="submit" disabled={loading}
                                    className="bg-[#0e2347] text-white p-4 rounded-g"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                            </form>
                            )}

                        <div className="grid grid-cols-3 gap-6 mt-6">
                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">10K+</h3>
                                <p className="text-gray-600">Verified Suppliers</p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">50K+</h3>
                                <p className="text-gray-600">Monthly Buyers</p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">24/7</h3>
                                <p className="text-gray-600">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
}