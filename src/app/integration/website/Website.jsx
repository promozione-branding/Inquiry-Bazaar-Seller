"use client";

import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Globe,
    CheckCircle2,
    XCircle,
    Loader2,
    Copy,
    Check,
    Link2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function WebsiteIntegration({ integration: initialIntegration, }) {
    const [integration, setIntegration] = useState(initialIntegration || null);
    const [loading, setLoading] = useState(!initialIntegration);
    const [connecting, setConnecting] = useState(false);
    const [copied, setCopied] = useState("");

    const isConnected = integration?.provider === "website" &&
        integration?.status === "connected";

    const userId = String(integration?.userId || "");
    const endpoint = "https://brandbnalo.com/api/form/add";

    useEffect(() => {
        if (initialIntegration) return;

        const loadIntegration = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    "/api/website/status"
                );

                if (response.data?.success) {
                    setIntegration(
                        response.data.integration || null
                    );
                }
            } catch (error) {
                console.error(
                    "Website integration status error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadIntegration();
    }, [initialIntegration]);

    const handleConnect = async () => {
        try {
            setConnecting(true);

            const response = await axios.post(
                "/api/website/connect"
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                    "Failed to connect website"
                );
            }

            setIntegration(response.data.integration);

            toast.success("Website connected successfully");
        } catch (error) {
            console.error(
                "Website connection error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to connect website"
            );
        } finally {
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            setConnecting(true);

            const response = await axios.post(
                "/api/website/disconnect"
            );

            if (!response.data?.success) {
                throw new Error(
                    response.data?.message ||
                    "Failed to disconnect website"
                );
            }

            setIntegration(
                response.data.integration || null
            );

            toast.success("Website disconnected");
        } catch (error) {
            console.error(
                "Website disconnect error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to disconnect website"
            );
        } finally {
            setConnecting(false);
        }
    };

    const copyText = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);

            setCopied(type);

            setTimeout(() => {
                setCopied("");
            }, 1500);

            toast.success("Copied");
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    const payload = {
        userId: userId || "USER_ID",
        platform: "Website Contact Page",
        platformEmail: "sales@example.com",
        name: "Arjun Patel",
        phone: "9898989898",
        email: "arjun.patel@client.in",
        product: "Social Media Management",
        place: "Mumbai, India",
        message:
            "We need help scaling our organic reach.",
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 flex justify-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Loader2
                            size={18}
                            className="animate-spin text-blue-600"
                        />
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-6">

            {/* ==================================================
                HEADER
            ================================================== */}
            <div className="flex items-center justify-between mb-4 w-full">

                <div className="flex items-center gap-3">

                    <Link
                        href="/settings"
                        className="
                            w-9 h-9
                            rounded-lg
                            border border-gray-200
                            bg-white
                            flex items-center justify-center
                            text-gray-600
                            hover:bg-gray-50
                        "
                    >
                        <ArrowLeft size={17} />
                    </Link>

                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Website Integration
                        </h1>

                        <p className="text-xs text-gray-500">
                            Connect your website to receive leads
                        </p>
                    </div>
                </div>

                {/* STATUS */}
                <div
                    className={`
                        flex items-center gap-1.5
                        px-2.5 py-1.5
                        rounded-full
                        text-xs font-medium
                        ${isConnected
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                    `}
                >
                    {isConnected ? (
                        <>
                            <CheckCircle2 size={14} />
                            Active
                        </>
                    ) : (
                        <>
                            <XCircle size={14} />
                            Inactive
                        </>
                    )}
                </div>
            </div>

            {/* ==================================================
                MAIN CARD
            ================================================== */}
            <div className="
                bg-white
                border border-gray-200
                rounded-2xl
                overflow-hidden w-full
            ">

                {/* HEADER */}
                <div className="
                    px-5 py-4
                    border-b border-gray-100
                    flex items-center gap-3
                ">

                    <div className="
                        w-10 h-10
                        rounded-xl
                        bg-blue-50
                        flex items-center justify-center
                    ">
                        <Globe
                            size={21}
                            className="text-blue-600"
                        />
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Website Lead Connection
                        </h2>

                        <p className="text-xs text-gray-500 mt-0.5">
                            Receive website enquiries directly in CRM
                        </p>
                    </div>
                </div>

                {/* ==================================================
                    NOT CONNECTED
                ================================================== */}
                {!isConnected && (
                    <div className="p-5 w-full">

                        <div className="
                            rounded-xl
                            border border-gray-200
                            bg-gray-50
                            p-5
                        ">

                            <div className="flex items-start gap-3">

                                <div className="
                                    w-9 h-9
                                    rounded-lg
                                    bg-white
                                    border border-gray-200
                                    flex items-center justify-center
                                    shrink-0
                                ">
                                    <Link2
                                        size={17}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        Connect your website
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                        mt-1
                                        leading-5
                                    ">
                                        Create a connection for this CRM
                                        account. After connecting, you will
                                        get a unique User ID and lead API
                                        endpoint.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleConnect}
                                disabled={connecting}
                                className="
                                    mt-4
                                    inline-flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-lg
                                    bg-blue-600
                                    text-white
                                    text-sm
                                    font-medium
                                    hover:bg-blue-700
                                    disabled:opacity-60
                                    disabled:cursor-not-allowed
                                    transition
                                "
                            >
                                {connecting ? (
                                    <>
                                        <Loader2
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Link2 size={16} />
                                        Connect Website
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ==================================================
                    CONNECTED
                ================================================== */}
                {isConnected && (
                    <div className="p-5 space-y-4 w-full">

                        {/* SUCCESS */}
                        <div className="
                            flex items-center gap-3
                            px-4 py-3
                            rounded-xl
                            bg-green-50
                            border border-green-100
                        ">
                            <CheckCircle2
                                size={19}
                                className="text-green-600 shrink-0"
                            />

                            <div>
                                <p className="text-sm font-medium text-green-800">
                                    Website connection is active
                                </p>

                                <p className="text-xs text-green-700 mt-0.5">
                                    Your website can now send leads to CRM.
                                </p>
                            </div>
                        </div>

                        {/* USER ID */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        User ID
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Used to identify the CRM account.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">

                                <div className="
                                    flex-1
                                    min-w-0
                                    px-3.5 py-2.5
                                    rounded-lg
                                    bg-gray-50
                                    border border-gray-200
                                    font-mono
                                    text-xs
                                    text-gray-700
                                    break-all
                                ">
                                    {userId}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            userId,
                                            "userId"
                                        )
                                    }
                                    className="
                                        w-10
                                        h-10
                                        shrink-0
                                        rounded-lg
                                        border border-gray-200
                                        bg-white
                                        flex items-center justify-center
                                        text-gray-500
                                        hover:bg-gray-50
                                    "
                                >
                                    {copied === "userId" ? (
                                        <Check
                                            size={16}
                                            className="text-green-600"
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ENDPOINT */}
                        <div>
                            <p className="text-sm font-medium text-gray-900 mb-1.5">
                                Lead API Endpoint
                            </p>

                            <div className="flex gap-2">

                                <div className="
                                    flex-1
                                    min-w-0
                                    px-3.5 py-2.5
                                    rounded-lg
                                    bg-gray-900
                                    text-gray-200
                                    font-mono
                                    text-xs
                                    break-all
                                ">
                                    POST {endpoint}
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            endpoint,
                                            "endpoint"
                                        )
                                    }
                                    className="
                                        w-10
                                        h-10
                                        shrink-0
                                        rounded-lg
                                        bg-gray-900
                                        text-gray-300
                                        flex items-center justify-center
                                        hover:bg-gray-800
                                    "
                                >
                                    {copied === "endpoint" ? (
                                        <Check
                                            size={16}
                                            className="text-green-400"
                                        />
                                    ) : (
                                        <Copy size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* PAYLOAD */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Request Payload
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Send the lead data in this format.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        copyText(
                                            JSON.stringify(
                                                payload,
                                                null,
                                                2
                                            ),
                                            "payload"
                                        )
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        px-2.5
                                        py-1.5
                                        rounded-lg
                                        border border-gray-200
                                        text-xs
                                        text-gray-600
                                        hover:bg-gray-50
                                    "
                                >
                                    {copied === "payload" ? (
                                        <>
                                            <Check size={13} />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <pre className="
                                p-4
                                rounded-xl
                                bg-gray-950
                                text-gray-300
                                font-mono
                                text-xs
                                leading-5
                                overflow-x-auto
                            ">
                                {JSON.stringify(payload, null, 2)}
                            </pre>
                        </div>

                        {/* DISCONNECT */}
                        <div className="
                            pt-4
                            border-t border-gray-100
                            flex items-center justify-between
                        ">
                            <div>
                                <p className="text-xs font-medium text-gray-700">
                                    Website connection
                                </p>

                                <p className="text-[11px] text-gray-400 mt-0.5">
                                    Disconnect to stop receiving website leads.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleDisconnect}
                                disabled={connecting}
                                className="
                                    px-3
                                    py-2
                                    rounded-lg
                                    border border-red-200
                                    text-red-600
                                    text-xs
                                    font-medium
                                    hover:bg-red-50
                                    disabled:opacity-50
                                "
                            >
                                {connecting
                                    ? "Please wait..."
                                    : "Disconnect"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
