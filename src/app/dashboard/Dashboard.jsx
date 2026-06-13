"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MessageSquare,
  Crown,
  Calendar,
  Phone,
  Mail,
  FolderKanban,
  BadgeCheck,
  Building2,
  User2,
  MapPin,
  BadgeInfo,
  Factory,
  BriefcaseBusiness,
  IndianRupee,
  Users,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  PhoneCall,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [businessDetails, setBusinessDetails] = useState(null)
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBusiness = async () => {
    try {
      const res = await axios.get("/api/profile/business", {
        headers: { "x-user-id": user?._id, },
      });

      if (res.data?.data) {
        setBusinessDetails(res.data?.data)
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data");
    }
  };

  const inquiries = [
    { company: "ABC Industries", product: "Steel Pipes", date: "12 Jun" },
    { company: "BuildTech", product: "Industrial Valves", date: "11 Jun" },
    { company: "Global Supply", product: "Copper Wire", date: "10 Jun" },
    { company: "Global Supply", product: "Copper Wire", date: "10 Jun" },
    { company: "Metro Infra", product: "Construction Material", date: "09 Jun" },
    { company: "Vision Engineering", product: "Machine Parts", date: "08 Jun" },
  ];

  const categories = [
    "Industrial",
    "Machinery",
    "Construction",
    "Electrical",
  ];

  const card = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=${"today"}`
        );

        if (response.data.success) {
          setLeadsData(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchBusiness();
      fetchLeads();
    }
  }, [user]);

  // console.log(businessDetails)

  return (
    <div className="w-full min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid lg:grid-cols-4 gap-5">
          <motion.div variants={card} initial="hidden" animate="show"
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center">
                <User size={36} className="text-white" />
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  IB Employee
                </h2>

                <p className="text-slate-500">
                  Account Manager
                </p>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex gap-3 text-slate-600">
                <Mail size={18} />
                employee@inquirybazaar.com
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-3 text-slate-600">
                  <Phone size={18} />
                  9999999999
                </div>
                <button className="flex gap-1 items-center bg-blue-500 text-xs hover:bg-blue-600 p-2 rounded-md text-white">
                  <PhoneCall size={14} /> Contact Now
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={card} initial="hidden" animate="show"
            transition={{ delay: 0.1 }}
            className="bg-indigo-600 text-white rounded-3xl p-6"
          >
            <div className="flex justify-between">
              <div>

                <p className="opacity-80">
                  Total Products
                </p>

                <h2 className="text-5xl font-bold mt-3">
                  10
                </h2>

              </div>

              <Package size={40} />
            </div>

            <p className="mt-6 text-indigo-100">
              Active listed products
            </p>
          </motion.div>

          <motion.div variants={card} initial="hidden" animate="show" transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-slate-500">
                  Dealing In
                </p>

                <h2 className="text-2xl font-bold">
                  4 Categories
                </h2>
              </div>

              <FolderKanban className="text-indigo-600" />
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((item) => (
                <span key={item} className="px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={card} initial="hidden" animate="show" transition={{ delay: 0.3 }}
            className="bg-emerald-600 text-white rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">

                  <p>Membership</p>

                  <span
                    className="
                      bg-white/20
                      px-2
                      py-1
                      rounded-full
                      text-sm
                      flex
                      items-center
                      gap-1
                    "
                  >
                    <BadgeCheck size={12} />
                    Active
                  </span>

                </div>

                <h2 className="text-3xl font-bold mt-2">
                  Elite Plan
                </h2>
              </div>

              <Crown />
            </div>

            <div className="space-y-3 mt-4">

              <div className="flex gap-2">
                <Calendar size={18} />
                Start • 01 Jan 2026
              </div>

              <div className="flex gap-2">
                <Calendar size={18} />
                End • 31 Dec 2026
              </div>

            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl py-6 px-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-indigo-600" />
              <h2 className="font-bold text-xl">
                Latest Inquiries
              </h2>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="grid md:grid-cols-2 gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i}
                    className="border border-slate-200 rounded-2xl p-4 animate-pulse"
                  >
                    <div className="flex justify-between">
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-32 bg-slate-200 rounded" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </div>

                      <div className="h-3 w-12 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : leadsData.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-2">
                {leadsData.slice(0, 6).map((item, i) => (
                  <motion.div key={i} whileHover={{ y: -2 }}
                    className="border border-slate-200 rounded-2xl py-4 px-3 hover:border-indigo-300 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold capitalize">
                          {item.name}
                        </h3>

                        <p className="text-slate-500">
                          {item.product}
                        </p>
                      </div>

                      <span className="text-sm text-slate-600">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-10 text-slate-500">
                No inquiries found
              </div>
            )}
          </motion.div>

          <motion.div variants={card} initial="hidden" animate="show" transition={{ delay: 0.5 }}
            className="rounded-3xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <h2 className="font-bold text-lg mb- text-center text-slate-800">
              Company Profile
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200">
                <img
                  src={user?.profileImage || "/no-image.png"}
                  alt="company"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-slate-800">
                  {businessDetails?.companyName}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <Factory size={16} className="text-indigo-600" />

                  <span className="text-slate-500">
                    {businessDetails?.businessType}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2">
                <InfoRow
                  icon={<User2 size={18} />}
                  label="CEO"
                  value={businessDetails?.ceoName}
                />

                <InfoRow
                  icon={<BadgeInfo size={18} />}
                  label="GST No"
                  value={businessDetails?.gstNumber}
                />
              </div>

              <InfoRow
                icon={<BriefcaseBusiness size={18} />}
                label="Business Field"
                value={businessDetails?.businessField}
              />

              {/* <InfoRow
                icon={<IndianRupee size={18} />}
                label="Annual Turnover"
                value={businessDetails?.annualTurnover}
              />

              <InfoRow
                icon={<Users size={18} />}
                label="Employees"
                value={businessDetails?.numberOfEmployees}
              /> */}

              <InfoRow
                icon={<MapPin size={18} />}
                label="Address"
                value={businessDetails?.address}
              />

              {/* Social */}
              <div className="border-t border-gray-300 pt-2">
                <p className="text-sm text-slate-600 mb-2">
                  Social Links
                </p>

                <div className="flex gap-2 justify-center">
                  {businessDetails?.social?.whatsapp && (
                    <a href={businessDetails.social.whatsapp} target="_blank"
                      className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center hover:scale-105">
                      <FaWhatsapp size={25} />
                    </a>
                  )}

                  {businessDetails?.social?.facebook && (
                    <a href={businessDetails.social.facebook} target="_blank"
                      className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105">
                      <Facebook />
                    </a>
                  )}

                  {businessDetails?.social?.youtube && (
                    <a href={businessDetails.social.youtube} target="_blank"
                      className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:scale-105">
                      <Youtube />
                    </a>
                  )}

                  {businessDetails?.social?.linkedin &&
                    <a
                      href={businessDetails?.social?.linkedin || "#"}
                      target="_blank"
                      className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105">
                      <Linkedin size={18} />
                    </a>}

                  {businessDetails?.social?.instagram && (
                    <a href={businessDetails.social.instagram} target="_blank"
                      className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600  flex items-center justify-center hover:scale-105">
                      <Instagram />
                    </a>
                  )}

                  {businessDetails?.social?.twitter &&
                    <a
                      href={businessDetails?.social?.twitter || "#"}
                      target="_blank"
                      className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:scale-105">
                      <Twitter size={18} />
                    </a>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-3 items-start">

      <div className="text-indigo-600 mt-1">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-600">
          {label}
        </p>

        <p className="text-sm text-slate-800 font-medium">
          {value || "-"}
        </p>
      </div>

    </div>
  );
}