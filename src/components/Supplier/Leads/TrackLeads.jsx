import React, { useEffect, useState } from "react";
import {
    Phone,
    MessageCircle,
    Eye,
    FileText,
    MousePointerClick,
    User,
    Mail,
    Clock,
    Smartphone,
    Globe,
    Activity,
    Loader2,
    Sparkles,
    Package
} from "lucide-react";

import { motion } from "framer-motion";
import axios from "axios";

export default function TrackLeads({ user, filter }) {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Event Icons
    const getEventIcon = (type) => {
        switch (type) {
            case "whatsapp_click":
                return <MessageCircle size={20} className="text-green-500" />;

            case "call_click":
                return <Phone size={20} className="text-blue-500" />;

            case "product_view":
                return <Eye size={20} className="text-purple-500" />;

            case "inquiry_submit":
                return <FileText size={20} className="text-orange-500" />;

            case "inquiry_open":
                return <MousePointerClick size={20} className="text-pink-500" />;

            default:
                return <Activity size={20} className="text-gray-500" />;
        }
    };

    // Event Labels
    const getEventLabel = (type) => {
        switch (type) {
            case "whatsapp_click":
                return "clicked WhatsApp";

            case "call_click":
                return "clicked Call";

            case "product_view":
                return "viewed Product";

            case "inquiry_submit":
                return "submitted Inquiry";

            case "inquiry_open":
                return "opened Inquiry";

            default:
                return type;
        }
    };

    // Detect Device
    const getDevice = (userAgent = "") => {
        if (/android/i.test(userAgent)) return "Android Mobile";
        if (/iphone|ipad|ipod/i.test(userAgent)) return "iPhone";
        if (/windows/i.test(userAgent)) return "Windows PC";
        if (/mac/i.test(userAgent)) return "MacBook";
        return "Unknown Device";
    };

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/tracking/events/supplier/${user?._id}?filter=${filter}`
                );

                if (response.data.success) {
                    setTrackingData(response.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching leads:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchLeads();
        }
    }, [user, filter]);

    return (
        <div className="">

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                </div>
            )}

            {!loading && trackingData.length === 0 && (
                <div className="bg-white rounded-3xl border border-gray-300 shadow-sm p-16 text-center">
                    <Activity size={50} className="mx-auto text-gray-300 mb-4" />

                    <h3 className="text-xl font-semibold text-gray-700">
                        No Activities Found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Buyer tracking activity will appear here
                    </p>
                </div>
            )}

            {/* Cards */}
            {!loading && trackingData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {trackingData.map((item, index) => (
                        <motion.div key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ y: -4 }}
                            className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="relative shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm">
                                                {getEventIcon(item.eventType)}
                                            </div>

                                            {/* Active Dot */}
                                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-[16px] leading-none font-semibold text-gray-800 truncate">
                                                {item?.buyerInfo?.name || "Unknown Buyer"}
                                            </h3>

                                            <p className="text-sm text-gray-500 font-medium">
                                                {getEventLabel(item.eventType)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="shrink-0">
                                        <span className="px-4 py-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wide shadow-sm whitespace-nowrap">
                                            {item.source || "Website"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-2.5 space-y-2.5">
                                <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                                    <p className="text-sm leading-6 text-gray-600">
                                        <span className="font-semibold text-gray-800">
                                            {item?.buyerInfo?.name || "A Buyer"}
                                        </span>{" "}
                                        interacted with your listing by{" "}
                                        <span className="font-medium text-blue-600">
                                            {getEventLabel(item.eventType)}
                                        </span>{" "}
                                        using{" "}
                                        <span className="font-medium text-green-600">
                                            {getDevice(item.userAgent)}
                                        </span>
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    {item?.buyerInfo?.email && (
                                        <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-2xl px-4 py-2">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Mail
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-800 mb-0.5">
                                                    Email
                                                </p>

                                                <p className="text-[15px] font-medium text-gray-800 truncate">
                                                    {item.buyerInfo.email}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {item?.buyerInfo?.phone && (
                                        <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-2xl px-4 py-2">
                                            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Phone
                                                    size={18}
                                                    className="text-green-600"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-800 mb-0.5">
                                                    Phone
                                                </p>

                                                <p className="text-[15px] font-medium text-gray-800">
                                                    {item.buyerInfo.phone}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-purple-50 transition rounded-2xl px-4 py-2">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Smartphone
                                                size={18}
                                                className="text-purple-600"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-800 mb-0.5">
                                                Device
                                            </p>

                                            <p className="text-[15px] font-medium text-gray-800">
                                                {getDevice(item.userAgent)}
                                            </p>
                                        </div>
                                    </div>

                                    {item?.ipAddress && (
                                        <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-orange-50 transition rounded-2xl px-4 py-2">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                <Globe
                                                    size={18}
                                                    className="text-orange-600"
                                                />
                                            </div>

                                            <div>
                                                <p className="text-xs text-gray-800 mb-0.5">
                                                    IP Address
                                                </p>

                                                <p className="text-[15px] font-medium text-gray-800">
                                                    {item.ipAddress}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-2xl px-4 py-2">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Package
                                                size={18}
                                                className="text-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-800 mb-0.5">
                                                Product
                                            </p>

                                            <p className="text-[15px] font-medium text-gray-800">
                                                {item.productName || item.productId || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
                                <div className="flex items-center w-full gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Clock
                                            size={14}
                                            className="text-indigo-600"
                                        />
                                    </div>

                                    <p className="text-sm flex justify-between text-gray-600 font-medium w-full">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                        <span className="text-gray-600 text-sm">
                                            {new Date(item.createdAt).toLocaleTimeString()}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}