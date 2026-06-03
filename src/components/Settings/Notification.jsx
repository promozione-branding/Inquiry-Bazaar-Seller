"use client";

import React, { useState } from "react";

import {
    ArrowLeft,
    Bell,
    Mail,
    Smartphone,
    MessageSquare,
    ShieldCheck,
} from "lucide-react";

export default function Notification({ setLayout }) {

    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        security: true,
    });

    const toggleNotification = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key],
        });
    };

    const notificationList = [
        {
            key: "email",
            title: "Email Notifications",
            description: "Receive account updates and important alerts via email.",
            icon: Mail,
            color: "bg-blue-100 text-blue-600",
        },
        {
            key: "push",
            title: "Push Notifications",
            description: "Get instant notifications directly on your device.",
            icon: Smartphone,
            color: "bg-purple-100 text-purple-600",
        },
        {
            key: "sms",
            title: "SMS Notifications",
            description: "Receive OTPs and important activity alerts on SMS.",
            icon: MessageSquare,
            color: "bg-green-100 text-green-600",
        },
        {
            key: "security",
            title: "Security Alerts",
            description: "Get notified about login activity and password changes.",
            icon: ShieldCheck,
            color: "bg-red-100 text-red-600",
        },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 max-w-2xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative">

                {/* BACK BUTTON */}
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

                <div className="bg-purple-100 p-4 rounded-2xl mb-3">
                    <Bell size={30} className="text-purple-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                    Notifications
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-md">
                    Manage how you receive alerts, updates, and important account notifications.
                </p>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="space-y-4">

                {notificationList.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.key}
                            className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-sm transition-all duration-200"
                        >

                            <div className="flex items-start gap-4">

                                <div className={`p-3 rounded-2xl ${item.color}`}>
                                    <Icon size={22} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* TOGGLE */}
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className={`relative w-14 h-8 rounded-full transition-all duration-300
                                ${
                                    notifications[item.key]
                                        ? "bg-purple-500"
                                        : "bg-gray-300"
                                }`}
                            >
                                <div
                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300
                                    ${
                                        notifications[item.key]
                                            ? "left-7"
                                            : "left-1"
                                    }`}
                                />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* SAVE BUTTON */}
            <button
                className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-md font-medium transition-all duration-200"
            >
                Save Preferences
            </button>
        </div>
    );
}