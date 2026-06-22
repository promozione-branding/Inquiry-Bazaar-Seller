import React, { useState, useMemo, useEffect } from 'react'
import { motion } from "framer-motion";
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
import { FaWhatsapp } from 'react-icons/fa';

export default function TrackLeads({ trackingData, search, view, loading, SkeletonCard }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredLeads = useMemo(() => {
    if (!search?.trim()) return trackingData;

    const q = search.toLowerCase();

    return trackingData.filter((lead) => {
      const createdDate = lead.createdAt
        ? new Date(lead.createdAt)
        : null;

      const searchable = [
        lead.name,
        lead.phone,
        lead.email,
        lead.productName,
        lead.userAgent,
        lead.ipAddress,

        // Dates
        createdDate?.toLocaleDateString(), // 20/06/2026
        createdDate?.toLocaleTimeString(), // 10:30 AM
        createdDate?.toLocaleString(),     // full
        createdDate?.toDateString(),       // Sat Jun 20 2026
      ];

      return searchable
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [trackingData, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  // console.log(trackingData)

  return (
    <div>
      {view == "table" &&
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Name
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Product
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Device
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Ip
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Time
                </th>
                {/* <th className="text-center py-4 px-4 font-semibold text-gray-600">
                  Actions
                </th> */}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    {[...Array(6)].map((_, i) => (
                      <td key={i} className="px-4 py-5">
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedLeads?.length > 0 ? (
                paginatedLeads.map((item, index) => (
                  <tr key={item._id}
                    className={`border-t border-gray-100 hover:bg-blue-50/40 transition ${index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/40"
                      }`}
                  >
                    {/* Buyer */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                          {getEventIcon(item.eventType)}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {item?.buyerInfo?.name ||
                              "Unknown Buyer"}
                          </h4>

                          <p className="text-sm text-gray-500">
                            {getEventLabel(item.eventType)}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">
                          {item.productName ||
                            item.productId ||
                            "-"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.source || "Website"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {getDevice(item.userAgent)}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4">
                      <span className="text-gray-800">
                        {item.ipAddress}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-4">
                      <div>
                        <p>
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500">
                          {new Date(
                            item.createdAt
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    {/* <td className="px-4 py-4">
                      <div className="flex gap-3 justify-center">

                        {item?.buyerInfo?.phone && (
                          <>
                            <button
                              onClick={() =>
                                window.open(
                                  `tel:${item.buyerInfo.phone}`
                                )
                              }
                              className="w-10 h-10 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center transition"
                            >
                              <Phone
                                size={20}
                                className="text-[#D01132]"
                              />
                            </button>

                            <button
                              onClick={() =>
                                window.open(
                                  `https://wa.me/${String(
                                    item.buyerInfo.phone
                                  ).replace(/\D/g, "")}`,
                                  "_blank"
                                )
                              }
                              className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition"
                            >
                              <FaWhatsapp
                                size={22}
                                className="text-green-600"
                              />
                            </button>
                          </>
                        )}

                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="bg-white border border-gray-200 shadow-sm p-16 text-center">

                      <Activity
                        size={50}
                        className="mx-auto text-gray-500 mb-4"
                      />

                      <h3 className="text-xl font-semibold text-gray-700">
                        No Activities Found
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Buyer tracking activity will
                        appear here
                      </p>

                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>}

      {view == "card" &&
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 px-2">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : paginatedLeads?.length > 0 ? (
            paginatedLeads.map((item, index) => (
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
            ))
          ) : (
            <div className="bg-white col-span-3 rounded-3xl border border-gray-300 shadow-sm p-16 text-center">
              <Activity size={50} className="mx-auto text-gray-500 mb-4" />

              <h3 className="text-xl font-semibold text-gray-700">
                No Activities Found
              </h3>

              <p className="text-gray-600 mt-2">
                Buyer tracking activity will appear here
              </p>
            </div>
          )}
        </div>}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>
          {" "}to{" "}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
          </span>
          {" "}of{" "}
          <span className="font-medium">
            {filteredLeads.length}
          </span>
          {" "}Inquiry
        </p>

        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button key={index} onClick={() => setCurrentPage(index + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
