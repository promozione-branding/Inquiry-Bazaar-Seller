"use client";

import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Globe,
    Facebook,
    Webhook,
    CheckCircle2,
    XCircle,
    Link2,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

export default function Integration({ setLayout }) {
    const [loading, setLoading] = useState(true);

    const [isMetaConnected, setIsMetaConnected] = useState(false);
    const [isWebhookConnected, setIsWebhookConnected] = useState(false);
    const [isWebsiteConnected, setIsWebsiteConnected] = useState(false);

    // --------------------------------------------------
    // CHECK ALL INTEGRATIONS
    // --------------------------------------------------
    useEffect(() => {
        const checkIntegrations = async () => {
            try {
                setLoading(true);


                try {
                    const response = await axios.get("/api/meta/status");

                    const data = response.data;

                    setIsMetaConnected(
                        data?.success &&
                        data?.integration?.status === "connected"
                    );
                } catch (error) {
                    console.error(
                        "Meta status error:",
                        error
                    );

                    setIsMetaConnected(false);
                }


                try {
                    const response = await axios.get("/api/webhook");

                    const data = response.data;
// console.log(data);
                    setIsWebhookConnected(
                        data?.success &&
                        data?.webhook?.status === "active"
                    );
                } catch (error) {
                    console.error(
                        "Webhook status error:",
                        error
                    );

                    setIsWebhookConnected(false);
                }


                try {
                    const response = await axios.get("/api/website/status");

                    const data = response.data;

                    setIsWebsiteConnected(
                        data?.success &&
                        data?.integration?.status === "connected"
                    );
                } catch (error) {
                    console.error(
                        "Website status error:",
                        error
                    );

                    setIsWebsiteConnected(false);
                }
            } catch (error) {
                console.error(
                    "Failed to check integrations:",
                    error
                );

                setIsMetaConnected(false);
                setIsWebhookConnected(false);
                setIsWebsiteConnected(false);
            } finally {
                setLoading(false);
            }
        };

        checkIntegrations();
    }, []);

    // --------------------------------------------------
    // STATUS COMPONENT
    // --------------------------------------------------
    const Status = ({ connected }) => {
        if (loading) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                    <Loader2
                        size={13}
                        className="animate-spin"
                    />
                    Checking...
                </span>
            );
        }

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${connected
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                    }`}
            >
                {connected ? (
                    <>
                        <CheckCircle2 size={13} />
                        Active
                    </>
                ) : (
                    <>
                        <XCircle size={13} />
                        Inactive
                    </>
                )}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 max-w-3xl mx-auto">

            {/* ==========================================
                HEADER
            ========================================== */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative">

                <button
                    onClick={() => setLayout(null)}
                    className="
                        absolute left-0 top-0
                        flex items-center gap-2
                        bg-white/80 backdrop-blur-md
                        border border-gray-200
                        text-gray-700
                        px-4 py-2
                        rounded-md
                        shadow-sm
                        hover:bg-white
                        hover:shadow-md
                        hover:-translate-y-0.5
                        transition-all duration-200
                    "
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">
                        Back
                    </span>
                </button>

                <div className="flex flex-col items-center">

                    <div className="bg-blue-100 p-4 rounded-2xl mb-2">
                        <Globe
                            size={28}
                            className="text-blue-600"
                        />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        Integration
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 max-w-lg">
                        Manage your CRM integrations and
                        connected lead sources.
                    </p>
                </div>
            </div>

            {/* ==========================================
                CARDS
            ========================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* ======================================
                    META
                ====================================== */}
                <div className="border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">

                    <div className="flex items-start justify-between mb-5">

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <Facebook
                                size={30}
                                className="text-blue-600"
                            />
                        </div>

                        <Status
                            connected={isMetaConnected}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Meta / Facebook
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        Connect Meta to receive and manage
                        Facebook lead inquiries.
                    </p>

                    <Link
                        href="/integration/meta"
                        className={`
                            mt-5 w-full
                            flex items-center justify-center gap-2
                            px-4 py-2.5
                            rounded-xl
                            font-semibold text-sm
                            transition-all
                            ${isMetaConnected
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }
                        `}
                    >
                        <Link2 size={16} />

                        {isMetaConnected
                            ? "Manage Meta"
                            : "Connect Meta"}
                    </Link>
                </div>

                {/* ======================================
                    WEBHOOK
                ====================================== */}
                <div className="border border-gray-200 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition-all">

                    <div className="flex items-start justify-between mb-5">

                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                            <Webhook
                                size={30}
                                className="text-purple-600"
                            />
                        </div>

                        <Status
                            connected={isWebhookConnected}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Webhook
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        Receive leads from your website,
                        WordPress, landing pages, or other platforms.
                    </p>

                    <Link
                        href="/integration/webhook"
                        className={`
                            mt-5 w-full
                            flex items-center justify-center gap-2
                            px-4 py-2.5
                            rounded-xl
                            font-semibold text-sm
                            transition-all
                            ${isWebhookConnected
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-purple-600 text-white hover:bg-purple-700"
                            }
                        `}
                    >
                        <Link2 size={16} />

                        {isWebhookConnected
                            ? "Manage Webhook"
                            : "Configure Webhook"}
                    </Link>
                </div>

                {/* ======================================
                    BRAND BNALO WEBSITE
                ====================================== */}
                <div className="border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all">

                    <div className="flex items-start justify-between mb-5">

                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <Globe
                                size={30}
                                className="text-blue-600"
                            />
                        </div>

                        <Status
                            connected={isWebsiteConnected}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                         Website
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        Connect your website to
                        receive leads directly in your CRM.
                    </p>

                    <Link
                        href="/integration/website"
                        className={`
                            mt-5 w-full
                            flex items-center justify-center gap-2
                            px-4 py-2.5
                            rounded-xl
                            font-semibold text-sm
                            transition-all
                            ${isWebsiteConnected
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }
                        `}
                    >
                        <Link2 size={16} />

                        {isWebsiteConnected
                            ? "Manage Website"
                            : "Connect Website"}
                    </Link>
                </div>

            </div>
        </div>
    );
}