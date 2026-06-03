"use client";
import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  Package,
  CreditCard,
  User,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const helpItems = [
  { name: "CATEGORY", icon: LayoutGrid, color: "bg-blue-100 text-blue-600" },
  { name: "PRODUCT", icon: Package, color: "bg-green-100 text-green-600" },
  { name: "PAYMENT", icon: CreditCard, color: "bg-yellow-100 text-yellow-600" },
  { name: "PROFILE", icon: User, color: "bg-purple-100 text-purple-600" },
  { name: "COMPLAINT", icon: AlertCircle, color: "bg-red-100 text-red-600" },
  { name: "OTHER", icon: HelpCircle, color: "bg-gray-100 text-gray-600" },
];

export default function Help() {
  const { user } = useSelector((state) => state.auth);
  const [helps, setHelps] = useState([]);
  useEffect(() => {
    if (user?._id) {
      fetchHelps();
    }
  }, [user]);

  const fetchHelps = async () => {
    try {
      const res = await axios.get("/api/help", {
        headers: { "x-user-id": user?._id, },
      });
      const data = res.data;
      setHelps(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 gap-8 bg-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {helpItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}
              className="h-46 flex flex-col items-center justify-center p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:scale-105"
            >
              <div className={`p-4 rounded-full mb-3 ${item.color}`}>
                <Icon size={28} />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-4">My Help Requests</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Subject</th>
                <th className="p-3">Issue</th>
                <th className="p-3">Description</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {helps.length > 0 ? (
                helps.map((item) => (
                  <tr key={item._id} className="border-b border-gray-300 hover:bg-gray-50 text-sm">
                    <td className="p-3">{item.subject}</td>
                    <td className="p-3">{item.issueType}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${item.status === "OPEN"
                          ? "bg-blue-100 text-[#0a5183]"
                          : item.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button className="bg-[#0a5183] hover:bg-[#054776] text-white px-3 p-1.5 text-sm font-semibold rounded-md">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No help requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}