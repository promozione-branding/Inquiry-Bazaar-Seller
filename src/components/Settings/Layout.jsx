"use client";

import React, { useState } from "react";
import {
    ArrowLeft,
    Lock,
    LogOut,
    Trash2,
    Bell,
    Globe,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ChangePassword from "./ChangePassword";
import SignOut from "./SignOut";
import DisableAccount from "./DisableAccount";
import Notification from "./Notification";
import Language from "./Language";

export default function Layout({ layout, setLayout, user }) {
    const router = useRouter();

    const renderContent = () => {
        switch (layout) {
            // CHANGE PASSWORD
            case "change-password":
                return (
                    <ChangePassword setLayout={setLayout} user={user} />
                );

            // SIGN OUT
            case "signout":
                return (
                    <SignOut setLayout={setLayout} user={user} />
                );

            // DISABLE ACCOUNT
            case "disable-account":
                return (
                    <DisableAccount setLayout={setLayout} user={user} />
                );

            // NOTIFICATIONS
            case "notifications":
                return (
                    <Notification setLayout={setLayout} user={user} />
                );

            // LANGUAGE
            case "language":
                return (
                    <Language setLayout={setLayout} user={user} />
                );

            // PROFILE SETTINGS
            case "profile-settings":
                router.push("/supplier/profile");
                return null;

            default: return <div>No Layout Found</div>;
        }
    };

    return (
        <div className="">
            {renderContent()}
        </div>
    );
}