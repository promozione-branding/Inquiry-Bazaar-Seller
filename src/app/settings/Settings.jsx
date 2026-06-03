"use client"
import React, { useState } from "react";
import {
  LuLock,
  LuLogOut,
  LuTrash2,
  LuBell,
  LuShieldCheck,
  LuMoon,
  LuGlobe,
  LuUser,
  LuChevronRight,
} from "react-icons/lu";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Layout from "@/components/Settings/Layout";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [layout, setLayout] = useState(null)

  const settings = [
    {
      id: "change-password",
      title: "Change Password",
      description: "Update your password to keep your account secure.",
      icon: <LuLock size={22} />,
      button: "Change",
      color: "blue",
    },
    {
      id: "signout",
      title: "Signout from all devices",
      description: "This will logout you from all devices.",
      icon: <LuLogOut size={22} />,
      button: "Signout",
      color: "orange",
    },
    {
      id: "disable-account",
      title: "Disable Account",
      description: "This will remove your account from Promote Bharat.",
      icon: <LuTrash2 size={22} />,
      button: "Disable",
      color: "red",
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage push notifications and email alerts.",
      icon: <LuBell size={22} />,
      button: "Manage",
      color: "purple",
    },
    {
      id: "language",
      title: "Language",
      description: "Choose your preferred application language.",
      icon: <LuGlobe size={22} />,
      button: "Select",
      color: "cyan",
    },
    {
      id: "profile-settings",
      title: "Profile Settings",
      description: "Edit your personal information and profile.",
      icon: <LuUser size={22} />,
      button: "Edit",
      color: "indigo",
    },
  ];

  const buttonColors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    red: "bg-red-500 hover:bg-red-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    green: "bg-green-500 hover:bg-green-600",
    gray: "bg-gray-700 hover:bg-gray-800",
    cyan: "bg-cyan-500 hover:bg-cyan-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600",
  };

  return (
    <div className="flex flex-col w-full lg:px-16 px-4 py-6 gap-6 bg-gray-100 min-h-screen">
      {layout == null ? <>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account preferences and security settings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {settings.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gray-100 text-gray-700">
                  {item.icon}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              <button onClick={() => { item.id === "profile-settings" ? router.push("/supplier/profile") : setLayout(item.id) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 ${buttonColors[item.color]}`} >
                {item.button}
                <LuChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">
            Account Information
          </h3>
          <p className="text-sm text-gray-500">
            Your account is currently active and protected with security features.
          </p>
        </div>
      </>
        : <Layout layout={layout} setLayout={setLayout} user={user} />}
    </div>
  );
}