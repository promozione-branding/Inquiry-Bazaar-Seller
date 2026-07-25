"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  CreditCard,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaPhone, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import SelectInput from "@/components/Inputs/SelectInput";
import Input from "@/components/Inputs/FormInput";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [modelOpen, setModelOper] = useState(false)
  const [plan, setPlan] = useState("")
  const [businessDetails, setBusinessDetails] = useState(null)
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [products, setProducts] = useState([]);

  const card = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  const [showingPrevious, setShowingPrevious] = useState(false);

  const handleSubmit = async () => {
    if (plan === "") return toast.error("Select your plan first")

    const data = {
      supplierToken: "7303486777",
      platform: "Seller Dashboard",
      platformEmail: "lead.inquirybazaar@gmail.com",
      name: user?.name || "NA",
      email: user?.email || "NA",
      company: businessDetails?.companyName || "NA",
      phone: user?.phone || "NA",
      product: `${plan} plan` || "NA",
      place: businessDetails?.address || "NA",
      message: "Inquiry for membership plan",
    };

    // if (!/^\d{10}$/.test(user?.phone)) {
    //   return toast.error("Enter a valid 10-digit phone number");
    // }

    try {
      setLoading1(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/add`, data,
        { validateStatus: (status) => status >= 200 && status < 500 }
      );
      if (res.status >= 200 && res.status < 300) {
        toast.success("Message send successfully");
        setTimeout(() => {
          setModelOper(false);
        }, 1000);
        setPlan("")
      }
    } catch (err) {
      console.log("ERROR:", err?.response || err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading1(false);
    }
  };

  const subCategories = useMemo(() => {
    const unique = [];

    products.forEach((p) => {
      if (p.subCategory && !unique.find((x) => x._id === p.subCategory._id)) {
        unique.push(p.subCategory);
      }
    });

    return unique;
  }, [products]);

  const fetchBusiness = async () => {
    const res = await axios.get("/api/profile/business", {
      headers: { "x-user-id": user?._id },
    });

    if (res.data?.data) {
      setBusinessDetails(res.data.data);
    }
  };

  const getProducts = async () => {
    const res = await axios.get(`/api/product?supplierId=${user._id}`);
    setProducts(res.data.data);
  };

  const fetchLeads = async () => {
    try {
      const todayRes = await axios.get(
        `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=today`
      );

      if (todayRes.data.success && todayRes.data.data?.length > 0) {
        setLeadsData(todayRes.data.data);
        setShowingPrevious(false);
        return;
      }

      const previousRes = await axios.get(
        `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=all`
      );

      if (previousRes.data.success) {
        setLeadsData(previousRes.data.data || []);
        setShowingPrevious(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?._id) return;

      try {
        setDashboardLoading(true);

        await Promise.all([
          fetchBusiness(),
          fetchLeads(),
          getProducts(),
        ]);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (dashboardLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-100 p-2 xl:p-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Top Cards */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-44 p-6 shadow-sm"
              >
                <div className="h-5 w-28 bg-slate-200 rounded mb-4" />
                <div className="h-10 w-20 bg-slate-200 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Section */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6">
              <div className="h-6 w-40 bg-slate-200 rounded mb-6" />

              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-2xl p-4"
                  >
                    <div className="h-4 w-32 bg-slate-200 rounded mb-3" />
                    <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                    <div className="h-3 w-full bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <div className="h-24 w-24 rounded-full bg-slate-200 mx-auto mb-4" />
              <div className="h-5 w-40 bg-slate-200 rounded mx-auto mb-3" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded" />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 p-2 xl:p-6">
      <div className="max-w-7xl mx-auto md:space-y-6 space-y-3">
        <div className="relative grid md:grid-cols-2 xl:grid-cols-4 md:gap-5 gap-3">
          <motion.div variants={card} initial="hidden" animate="show"
            className="bg-white rounded-3xl py-5 px-4 shadow-sm"
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

            <div className="mt-3 space-y-2">
              <a href="mailto:care@inquirybazaar.com" className="flex items-center gap-2 text-slate-600">
                <Mail size={18} />
                care@inquirybazaar.com
              </a>

              <div className="flex justify-between items-center">
                <a href="tel:+917303486777" className="flex items-center gap-1.5 text-slate-600">
                  <Phone size={16} />
                  +917303486777
                </a>

                <div className="flex gap-2 items-center">
                  <a href="tel:+917303486777" className="flex gap-1 items-center bg-red-600 text-xs hover:bg-red-700 p-2 rounded-md text-white">
                    <FaPhoneAlt size={18} />
                  </a>
                  <a href="https://wa.me/917303486777" target="blank" className="flex items-center bg-green-600 text-xs hover:bg-green-700 p-2 rounded-md text-white">
                    <FaWhatsapp size={20} />
                  </a>
                </div>
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
                  {products.length || "NA"}
                </h2>
              </div>

              <Package size={40} />
            </div>

            <p className="mt-6 text-indigo-100">
              Active listed products
            </p>
          </motion.div>

          <motion.div variants={card} initial="hidden" animate="show" transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-2 shadow-sm"
          >
            <div className="flex items-center justify-between px-2">

              <div>
                <p className="text-slate-500">
                  Dealing In
                </p>

                <h2 className="text-2xl font-bold">
                  {subCategories.length} Categories
                </h2>
              </div>

              <FolderKanban className="text-indigo-600" />
            </div>

            <div className="flex flex-wrap gap-2 mt-2 max-h-30 overflow-x-auto pr-1
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:rounded-full
    [&::-webkit-scrollbar-track]:bg-slate-100
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:bg-indigo-400
    hover:[&::-webkit-scrollbar-thumb]:bg-indigo-600">
              {subCategories.map((item) => (
                <span key={item} className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                  {item.name}
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
                    N/A
                  </span>

                </div>

                <h2 className="text-3xl font-bold mt-2">
                  No Active Plan
                </h2>
              </div>

              <Crown />
            </div>

            <div className="space-y-3 mt-4">

              <div className="flex gap-2">
                <Calendar size={18} />
                N/A
              </div>

              <div className="flex gap-2">
                <Calendar size={18} />
                N/A
              </div>

            </div>

            <button onClick={() => setModelOper(true)} className="absolute bg-white/20 px-2 py-1 rounded-full text-[13px] font-medium flex items-center gap-1 bottom-2 right-2.5 duration-300 cursor-pointer hover:scale-105 transition-all">
              Upgrade Now
            </button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 xl:gap-6 gap-3">
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl py-6 px-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-indigo-600" />
              <h2 className="font-bold text-xl">
                Latest Inquiries
              </h2>
            </div>

            {showingPrevious && (
              <div className="mb-4 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                No leads received today. Showing previous inquiries.
              </div>
            )}

            {leadsData.length > 0 ? (
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

                        <p className="text-slate-500 line-clamp-2">
                          {item.product}
                        </p>
                      </div>

                      <span className="text-sm text-slate-600 text-nowrap">
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
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="company"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-5xl font-bold bg-gray-100 text-slate-700 items-center h-full flex justify-center">
                    {businessDetails?.companyName?.charAt(0).toUpperCase() || "N"}
                  </div>
                )}
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
              <div className="grid xl:grid-cols-2 gap-2">
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
                icon={<IndianRupee size={18} />}
                label="Annual Turnover"
                value={businessDetails?.annualTurnover}
              />

              <InfoRow
                icon={<BriefcaseBusiness size={18} />}
                label="Business Field"
                value={businessDetails?.businessField}
              />

              {/* <InfoRow
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

      <Modal open={modelOpen} onClose={() => setModelOper(false)}>
        <Modal.Header title="Contact Us" />
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                label="Membership Plan"
                Icon={CreditCard}
                name="membershipPlan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                options={["Elite", "Pro", "Growth", "Starter"].map((c) => ({
                  label: c,
                  value: c,
                }))}
              />
              <Input
                label="Your Name"
                type="text"
                Icon={User}
                name="name"
                disabled
                value={user?.name}
              // onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Your Phone"
                type="tel"
                Icon={Phone}
                name="phone"
                disabled
                value={user?.phone}
              // onChange={handleChange}
              />
              <Input
                label="Your Email"
                type="text"
                Icon={Mail}
                name="email"
                disabled
                value={user?.email}
              // onChange={handleChange}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button disabled={loading1} onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-[#f45a06] hover:bg-[#e45407]">
              {loading1 ? "Sending..." : "Send"}
            </button>
            <button onClick={() => setModelOper(false)} className="border border-gray-300 px-4 py-2 rounded-md text-black bg-gray-100 hover:bg-gray-200">
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
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