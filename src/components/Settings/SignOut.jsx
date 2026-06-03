"use client";
import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    LogOut,
    Smartphone,
    ShieldCheck,
    Monitor,
    Laptop,
    SmartphoneIcon,
    Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Input from "@/components/Inputs/FormInput";
import { sendFirebaseOtp, verifyFirebaseOtp } from "@/utils/firebaseOtp";

export default function SignOut({ setLayout, user }) {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [devices, setDevices] = useState([]);

    const sendOtp = async () => {
        const response = await sendFirebaseOtp(`+91${user?.phone}`, "logout-recaptcha");

        if (response.success) {
            toast.success("OTP Sent Successfully");
            setStep(2);
        } else {
            toast.error(response.error.message);
        }
    };

    const verifyOtp = async () => {
        if (!otp) return toast.error("Enter OTP First");

        const response = await verifyFirebaseOtp(otp);

        if (response.success) {
            toast.success("OTP Verified Successfully");
            setStep(3);
        } else {
            toast.error("Invalid OTP");
        }
    };

    const removeDevice = async (id) => {
        try {
            console.log(id)
            const res = await axios.delete(`/api/auth/sessions/${id}`);

            if (res.data.success) {
                toast.success(res.data.message);
                // update UI instantly
                fetchDevices()
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error removing device");
        }
    };

    const logoutAllDevices = async () => {
        try {
            const res = await axios.post("/api/auth/logout-all");

            if (res.data.success) {
                toast.success("All other devices logged out");

                fetchDevices(); // refresh list
            } else {
                toast.error("Failed to logout devices");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error logging out");
        }
    };

    const fetchDevices = async () => {
        try {
            const res = await axios.get("/api/auth/sessions");
            if (res.data.success) {
                const updatedDevices = res.data.sessions.map((device) => ({
                    ...device,
                    current: device._id === res.data.currentSessionId,
                }));
                setDevices(updatedDevices);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (step === 3) {
            fetchDevices();
        }
    }, [step]);

    const getIcon = (type) => {
        switch (type) {
            case "mobile":
                return Smartphone;
            case "desktop":
                return Laptop;
            default:
                return Monitor;
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

                <div className="bg-orange-100 p-4 rounded-2xl mb-2">
                    <LogOut size={28} className="text-orange-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                    Signout All Devices
                </h2>

                <p className="text-sm text-gray-500 mt-1 max-w-md">
                    Verify your mobile number before signing out from all devices.
                </p>
            </div>

            <div className="flex justify-center w-full mb-6">
                <div className="flex items-center justify-center max-w-2xl w-full">
                    {["Phone", "Verify OTP", "Devices"].map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center min-w-25">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                                    ${step >= index + 1
                                            ? "bg-orange-500 text-white"
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
                                            ? "bg-orange-500"
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
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 text-white p-3 rounded-xl">
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
                        className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition"
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

                    <button onClick={verifyOtp} className="cursor-pointer w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Verify OTP
                    </button>
                </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <div className="space-y-5">
                    <div className="space-y-4">
                        {devices.map((device) => {
                            const Icon = getIcon(device.deviceType);
                            return (
                                <div key={device._id}
                                    className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-100 p-3 rounded-md border border-gray-300">
                                            <Icon size={25} className="text-gray-800" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {device?.deviceName || "Unknown Device"}
                                            </h3>

                                            <p className="text-sm text-gray-800">
                                                Login Time:{" "}
                                                {new Date(device?.lastSeen).toLocaleString("en-IN",
                                                    { dateStyle: "medium", timeStyle: "short", })}
                                            </p>

                                            <p className="text-xs text-gray-800">
                                                IP: {device?.ip || "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    {device.current ? (
                                        <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                            Current Device
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => removeDevice(device?._id)}
                                            className="bg-red-100 text-red-500 p-2 hover:bg-red-200 rounded-lg transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={logoutAllDevices} className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition"
                    >
                        Logout All Devices
                    </button>
                </div>
            )}

            <div id="logout-recaptcha"></div>
        </div>
    );
}