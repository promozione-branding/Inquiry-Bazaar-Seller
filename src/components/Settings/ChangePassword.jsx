"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Lock,
    ShieldCheck,
    Smartphone,
    KeyRound, Eye, EyeOff,
} from "lucide-react";
import Input from '@/components/Inputs/FormInput';
import toast from "react-hot-toast";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import axios from "axios";

export default function ChangePassword({ setLayout, user }) {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        phone: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const sendOtp = async () => {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth, "recaptcha-container",
                    {
                        size: "invisible",
                        callback: (response) => {
                            console.log("Recaptcha Verified");
                        },
                    }
                );
            }

            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = `+91${user?.phone}`;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                phoneNumber,
                appVerifier
            );

            window.confirmationResult = confirmationResult;
            toast.success("OTP Sent Successfully");

            setStep(2);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // VERIFY OTP
    const verifyOtp = async () => {
        try {
            if (!form.otp) {
                toast.error("Enter OTP First");
                return;
            }
            const result = await window.confirmationResult.confirm(form.otp);
            console.log(result.user);
            toast.success("OTP Verified Successfully");
            setStep(3);
        } catch (error) {
            console.log(error);
            toast.error("Invalid OTP");
        }
    };

    // CHANGE PASSWORD
    const updatePassword = async () => {
        try {

            if (form.newPassword !== form.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            const response = await axios.put("/api/auth/update",
                { password: form.newPassword, },
                { headers: { "x-user-id": user?._id, }, }
            );

            console.log(response.data);
            toast.success("Password Updated Successfully");
            setLayout(null)
            setForm({
                ...form,
                newPassword: "",
                confirmPassword: "",
            });

        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.error ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center mb-6 relative">
                <button
                    onClick={() => setLayout(null)}
                    className="absolute left-0 top-0 flex items-center gap-2 
                    bg-white/80 backdrop-blur-md border border-gray-200 
                    text-gray-700 px-4 py-2 rounded-md shadow-sm 
                    hover:bg-white hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Back</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-2xl mb-2">
                        <Lock size={28} className="text-blue-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        Change Password
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                        Verify your mobile number before changing your password securely.
                    </p>
                </div>
            </div>

            <div className="flex justify-center w-full mb-5">
                <div className="flex items-center justify-center max-w-2xl w-full">
                    {["Phone", "Verify OTP", "New Password"].map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center min-w-25">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                        ${step >= index + 1
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {index + 1}
                                </div>

                                <span className="mt-3 text-sm font-medium text-gray-600 text-center">
                                    {item}
                                </span>
                            </div>

                            {index !== 2 && (
                                <div
                                    className={`w-32 h-1 rounded-full mx-2 mb-6 transition-all duration-300
                        ${step > index + 1
                                            ? "bg-blue-500"
                                            : "bg-gray-200"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 text-white p-3 rounded-xl">
                                <Smartphone size={22} />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    OTP will be sent to
                                </p>

                                <h3 className="text-lg font-semibold text-gray-800">
                                    +91 {user?.phone}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <button onClick={sendOtp}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Send OTP
                    </button>
                </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
                <div className="space-y-5">
                    <Input
                        label="Enter OTP"
                        name="otp"
                        type="number"
                        Icon={ShieldCheck}
                        value={form.otp}
                        onChange={handleChange}
                    />

                    <button
                        onClick={verifyOtp}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>

                        <div className="relative">
                            <KeyRound
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="Enter new password"
                                value={form.newPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-12 outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-12 outline-none focus:ring-1 focus:ring-indigo-500"
                            />

                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button onClick={updatePassword}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Update Password
                    </button>
                </div>
            )}

            <div id="recaptcha-container"></div>
        </div>
    );
}