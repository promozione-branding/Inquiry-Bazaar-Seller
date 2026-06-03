"use client";
import React, { useState } from "react";
import {
    ArrowLeft,
    Trash2,
    Smartphone,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "@/firebase/config";
import Input from "@/components/Inputs/FormInput";

export default function DisableAccount({ setLayout, user }) {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");

    // SEND OTP
    const sendOtp = async () => {
        try {
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new RecaptchaVerifier(
                    auth,
                    "disable-account-recaptcha",
                    {
                        size: "invisible",
                        callback: () => {
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
            if (!otp) {
                toast.error("Enter OTP");
                return;
            }

            const result = await window.confirmationResult.confirm(otp);
            console.log(result.user);
            toast.success("OTP Verified Successfully");
            setStep(3);
        } catch (error) {
            console.log(error);
            toast.error("Invalid OTP");
        }
    };

    // DISABLE ACCOUNT
    const disableAccount = async () => {
        try {

            // API CALL HERE

            toast.success("Account Disabled Successfully");

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");
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

                    <div className="bg-red-100 p-4 rounded-2xl mb-2">
                        <Trash2 size={28} className="text-red-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        Disable Account
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                        Verify your mobile number before disabling your account.
                    </p>
                </div>
            </div>

            <div className="flex justify-center w-full mb-6">
                <div className="flex items-center justify-center max-w-2xl w-full">
                    {["Phone", "Verify OTP", "Disable"].map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center min-w-25">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                                    ${step >= index + 1
                                            ? "bg-red-500 text-white"
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
                                            ? "bg-red-500"
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
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500 text-white p-3 rounded-xl">
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

                    <button
                        onClick={sendOtp}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
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
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
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
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <div className="bg-red-500 text-white p-3 rounded-xl">
                                <AlertTriangle size={22} />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-red-600">
                                    Warning
                                </h3>

                                <p className="text-sm text-gray-600 mt-1">
                                    Disabling your account will:
                                </p>

                                <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
                                    <li>Logout you from all devices</li>
                                    <li>Hide your profile and services</li>
                                    <li>Disable account access temporarily</li>
                                    <li>You can contact support to reactivate</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button onClick={disableAccount}
                        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Disable My Account
                    </button>
                </div>
            )}

            <div id="disable-account-recaptcha"></div>
        </div>
    );
}