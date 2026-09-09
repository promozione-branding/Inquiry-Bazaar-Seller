import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  MessageSquare,
  Building2,
  Globe,
  Activity,
  Eye,
  MoreVertical,
  Plus,
  Download,
  X,
  Hash,
  ReceiptText,
  CalendarDays,
  Tag,
  BriefcaseBusiness,
  CircleDollarSign,
  Megaphone,
  Pencil,
  Trash2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Modal from "@/components/Modal/Modal";
import Link from "next/link";

export default function InquiryLeads({
  leadsData,
  view,
  loading,
  SkeletonCard,
  currentPage,
  setCurrentPage,
  pagination,
  limit,
  setLimit,
  onAddLead,
  onExportLeads,
}) {
  const [detail, setDetails] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") {
      return "-";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  const getSourceLabel = (source) => {
    if (!source) return "-";

    return source
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStageLabel = (stage) => {
    if (!stage) return "-";

    return stage
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStageClass = (stage) => {
    switch (stage) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-cyan-100 text-cyan-700";
      case "qualified":
        return "bg-violet-100 text-violet-700";
      case "proposal_sent":
        return "bg-amber-100 text-amber-700";
      case "negotiation":
        return "bg-orange-100 text-orange-700";
      case "won":
        return "bg-green-100 text-green-700";
      case "lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-blue-100 text-blue-700";
      case "junk":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openPhone = (phone) => {
    if (!phone) return;
    window.open(`tel:${phone} `);
  };

  const openWhatsapp = (lead) => {
    const phone = String(lead?.whatsapp || lead?.phone || "").replace(
      /\D/g,
      ""
    );

    if (!phone) return;

    window.open(`https://wa.me/${phone}`, "_blank");
  };

  const LeadInfo = ({
    icon: Icon,
    label,
    value,
    iconClass = "text-[#074977]",
    bgClass = "bg-[#074977]/10",
  }) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return null;
    }

    return (
      <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div
          className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center shrink-0`}
        >
          <Icon size={17} className={iconClass} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 mb-1">
            {label}
          </p>

          <p className="text-sm font-medium text-gray-800 break-words">
            {value}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {view === "table" && (
        <div className="overflow-x-aut">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Name
                </th>

                <th className="text-left sm:table-cell hidden py-4 px-4 font-semibold text-gray-600">
                  Product
                </th>

                <th className="text-left sm:table-cell hidden py-4 px-4 font-semibold text-gray-600">
                  Phone
                </th>

                <th className="text-left py-4 sm:table-cell hidden px-4 font-semibold text-gray-600">
                  Email
                </th>

                <th className="text-left py-4 sm:table-cell hidden px-4 font-semibold text-gray-600">
                  Stage
                </th>

                <th className="text-left py-4 sm:table-cell hidden px-4 font-semibold text-gray-600">
                  Time
                </th>

                <th className="text-center py-4 px-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                [...Array(8)].map((_, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200"
                  >
                    {[...Array(7)].map((_, i) => (
                      <td key={i} className="px-4 py-5">
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leadsData?.length > 0 ? (leadsData.map((lead, index) => (
                <tr key={lead._id} className={`border-t border-gray-100 hover:bg-blue-50/40 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                  {/* USER */}
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-[#074977]/10 border border-[#074977]/10 flex items-center justify-center">
                          <User
                            size={18}
                            className="text-[#074977]"
                          />
                        </div>

                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate line-clamp-1 sm:w-40">
                          {lead.name || "-"}
                        </h4>

                        <div className="flex items-center gap-1 mt-1">
                          <Globe
                            size={12}
                            className="text-[#074977]"
                          />

                          <span className="text-xs text-gray-500 truncate">
                            {lead.source
                              ? getSourceLabel(lead.source)
                              : lead.platform?.replace(
                                "https://",
                                ""
                              ) || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* PRODUCT */}
                  <td className="px-2 py-2 sm:table-cell hidden">
                    {lead.product ? (
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Building2
                            size={16}
                            className="text-indigo-600"
                          />
                        </div>

                        <p className="font-medium line-clamp-1 sm:w-40">
                          {lead.product}
                        </p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* PHONE */}
                  <td className="px-2 py-2 sm:table-cell hidden">
                    <div className="flex items-center gap-2">
                      <Phone
                        size={14}
                        className="text-[#D01132]"
                      />

                      <span className="line-clamp-1 sm:w-40">{lead.phone || "-"}</span>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-2 py-2 line-clamp-1 sm:w-40 sm:table-cell hidden">
                    {lead.email || "-"}
                  </td>

                  {/* STAGE */}
                  <td className="px-2 py-2 sm:table-cell hidden">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStageClass(
                        lead.stage
                      )}`}
                    >
                      {getStageLabel(lead.stage)}
                    </span>
                  </td>

                  {/* TIME */}
                  <td className="px-2 py-2 sm:table-cell hidden">
                    <div className="text-nowrap">
                      <p>
                        {formatDate(lead.createdAt)}
                      </p>

                      <p className="text-xs text-gray-500">
                        {lead.createdAt
                          ? new Date(
                            lead.createdAt
                          ).toLocaleTimeString(
                            "en-IN"
                          )
                          : "-"}
                      </p>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-2 py-2">
                    <div className="flex gap-2 justify-center items-center">
                      <div className="relative">
                        <button type="button" onClick={() => setMenuOpen((prev) => prev === lead._id ? null : lead._id)}
                          className={`w-8 h-8 rounded-md border flex items-center justify-center transition ${menuOpen === lead._id
                            ? "bg-gray-100 border-gray-400"
                            : "border-gray-300 bg-white hover:bg-gray-50"
                            }`}
                          title="More actions"
                        >
                          <MoreVertical
                            size={20}
                            className="text-gray-700"
                          />
                        </button>

                        {menuOpen === lead._id && (
                          <>
                            {/* BACKDROP */}
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />

                            {/* MENU */}
                            <div className="absolute right-0 top-9 z-50 w-52 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpen(null);
                                  setDetails(lead);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 transition"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <Eye
                                    size={17}
                                    className="text-blue-600"
                                  />
                                </div>

                                <span>View Details</span>
                              </button>

                              <Link href={`/leads/edit/${lead._id}`}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-yellow-50 transition border-t border-gray-100"
                              >
                                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                  <Pencil size={17} className="text-yellow-600" />
                                </div>
                                <span>Edit Lead</span>
                              </Link>

                              {/* <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpen(null);
                                    onDeleteLead?.(lead);
                                  }}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <Trash2 size={17} className="text-red-600" />
                                  </div>
                                  <span>Delete Lead</span>
                                </button> */}

                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpen(null);
                                  openPhone(lead.phone);
                                }}
                                disabled={!lead.phone}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 transition border-t border-gray-100 disabled:opacity-40"
                              >
                                <div className="w-8 h-8 rounded-lg bg-[#D01132]/10 flex items-center justify-center">
                                  <Phone
                                    size={17}
                                    className="text-[#D01132]"
                                  />
                                </div>

                                <span>Call</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpen(null);
                                  openWhatsapp(lead);
                                }}
                                disabled={!lead.whatsapp && !lead.phone}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 transition border-t border-gray-100 disabled:opacity-40"
                              >
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                  <FaWhatsapp
                                    size={20}
                                    className="text-green-600"
                                  />
                                </div>

                                <span>WhatsApp</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="bg-white border border-gray-200 shadow-sm p-16 text-center">
                      <Activity
                        size={50}
                        className="mx-auto text-gray-500 mb-4"
                      />

                      <h3 className="text-xl font-semibold text-gray-700">
                        No Leads Found
                      </h3>

                      <p className="text-gray-600 mt-2">
                        Your leads will appear here
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4 px-2">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : leadsData?.length > 0 ? (
            leadsData.map((lead, index) => (
              <motion.div
                key={lead._id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-xl bg-[#074977]/10 border border-[#074977]/10 flex items-center justify-center">
                          <User
                            size={20}
                            className="text-[#074977]"
                          />
                        </div>

                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold text-gray-800 truncate">
                          {lead.name || "-"}
                        </h3>

                        <div className="flex items-center gap-2 mt-0.5">
                          <Globe
                            size={13}
                            className="text-[#074977]"
                          />

                          <p className="text-sm text-gray-500 truncate">
                            {lead.source
                              ? getSourceLabel(lead.source)
                              : lead.platform?.replace(
                                "https://",
                                ""
                              ) || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDetails(lead)
                        }
                        className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition shrink-0"
                        title="View details"
                      >
                        <Eye
                          size={19}
                          className="text-blue-600"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openPhone(lead.phone)
                        }
                        disabled={!lead.phone}
                        className="w-10 h-10 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center transition shrink-0 disabled:opacity-40"
                      >
                        <Phone
                          size={20}
                          className="text-[#D01132]"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openWhatsapp(lead)
                        }
                        disabled={
                          !lead.whatsapp &&
                          !lead.phone
                        }
                        className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition shrink-0 disabled:opacity-40"
                      >
                        <FaWhatsapp
                          size={23}
                          className="text-green-600"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <LeadInfo
                      icon={Phone}
                      label="Phone"
                      value={lead.phone}
                      iconClass="text-[#D01132]"
                      bgClass="bg-red-100"
                    />

                    <LeadInfo
                      icon={Mail}
                      label="Email"
                      value={lead.email}
                      iconClass="text-cyan-600"
                      bgClass="bg-cyan-100"
                    />

                    <LeadInfo
                      icon={Building2}
                      label="Product"
                      value={lead.product}
                      iconClass="text-indigo-600"
                      bgClass="bg-indigo-100"
                    />

                    <LeadInfo
                      icon={MapPin}
                      label="Location"
                      value={lead.place}
                      iconClass="text-orange-600"
                      bgClass="bg-orange-100"
                    />

                    <LeadInfo
                      icon={CircleDollarSign}
                      label="Deal Value"
                      value={formatCurrency(
                        lead.dealValue
                      )}
                      iconClass="text-green-600"
                      bgClass="bg-green-100"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStageClass(
                        lead.stage
                      )}`}
                    >
                      {getStageLabel(lead.stage)}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                        lead.status
                      )}`}
                    >
                      {lead.status || "-"}
                    </span>
                  </div>

                  {lead.message && (
                    <div className="rounded-xl border border-[#074977]/10 bg-gradient-to-br from-[#074977]/5 to-[#D01132]/5 px-4 py-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MessageSquare
                          size={16}
                          className="text-[#074977]"
                        />

                        <p className="text-sm font-semibold text-gray-800">
                          Message
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 leading-6 line-clamp-3">
                        {lead.message}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white col-span-3 rounded-3xl border border-gray-300 shadow-sm p-16 text-center">
              <Activity
                size={50}
                className="mx-auto text-gray-500 mb-4"
              />

              <h3 className="text-xl font-semibold text-gray-700">
                No Leads Found
              </h3>

              <p className="text-gray-600 mt-2">
                Your leads will appear here
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {pagination?.total > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    currentPage * limit,
                    pagination.total
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.total}
                </span>{" "}
                Leads
              </>
            ) : (
              "No Leads"
            )}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              Show
            </span>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              disabled={loading}
              className="px-3 py-2 min-w-[75px] border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
              <option value={100}>100</option>
            </select>

            <span className="text-sm text-gray-500 whitespace-nowrap">
              per page
            </span>
          </div>
        </div>

        {pagination?.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (
                  pagination.hasPrevPage &&
                  !loading
                ) {
                  setCurrentPage(
                    (page) => page - 1
                  );
                }
              }}
              disabled={
                !pagination.hasPrevPage ||
                loading
              }
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[400px]">
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => {
                    if (!loading) {
                      setCurrentPage(page);
                    }
                  }}
                  disabled={loading}
                  className={`
                    min-w-10 h-10 px-3 rounded-lg
                    text-sm font-medium transition
                    disabled:cursor-not-allowed
                    ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (
                  pagination.hasNextPage &&
                  !loading
                ) {
                  setCurrentPage(
                    (page) => page + 1
                  );
                }
              }}
              disabled={
                !pagination.hasNextPage ||
                loading
              }
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Modal
        open={!!detail}
        onClose={() => setDetails(null)}
      >
        <Modal.Header title="Lead Details" />

        <Modal.Body>
          {detail && (
            <div className="max-h-[70vh] overflow-y-auto pr-1">
              {/* Header */}
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-[#074977]/5 to-[#D01132]/5 p-5 mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-[#074977]/10 border border-[#074977]/10 flex items-center justify-center">
                        <User
                          size={25}
                          className="text-[#074977]"
                        />
                      </div>

                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-bold text-gray-800">
                        {detail.name || "-"}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {getSourceLabel(
                            detail.source
                          )}
                        </span>

                        <span className="text-gray-300">
                          •
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStageClass(
                            detail.stage
                          )}`}
                        >
                          {getStageLabel(
                            detail.stage
                          )}
                        </span>

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            detail.status
                          )}`}
                        >
                          {detail.status || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openPhone(detail.phone)
                      }
                      disabled={!detail.phone}
                      className="w-11 h-11 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center disabled:opacity-40"
                      title="Call"
                    >
                      <Phone
                        size={20}
                        className="text-[#D01132]"
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openWhatsapp(detail)
                      }
                      disabled={
                        !detail.whatsapp &&
                        !detail.phone
                      }
                      className="w-11 h-11 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center disabled:opacity-40"
                      title="WhatsApp"
                    >
                      <FaWhatsapp
                        size={23}
                        className="text-green-600"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <User
                    size={18}
                    className="text-[#074977]"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <LeadInfo
                    icon={User}
                    label="Name"
                    value={detail.name}
                  />

                  <LeadInfo
                    icon={Phone}
                    label="Phone"
                    value={detail.phone}
                    iconClass="text-[#D01132]"
                    bgClass="bg-red-100"
                  />

                  <LeadInfo
                    icon={Mail}
                    label="Email"
                    value={detail.email}
                    iconClass="text-cyan-600"
                    bgClass="bg-cyan-100"
                  />

                  <LeadInfo
                    icon={Building2}
                    label="Company Name"
                    value={detail.companyName}
                    iconClass="text-indigo-600"
                    bgClass="bg-indigo-100"
                  />

                  <LeadInfo
                    icon={ReceiptText}
                    label="GST Number"
                    value={detail.gstNumber}
                    iconClass="text-violet-600"
                    bgClass="bg-violet-100"
                  />

                  <LeadInfo
                    icon={MapPin}
                    label="Place"
                    value={detail.place}
                    iconClass="text-orange-600"
                    bgClass="bg-orange-100"
                  />
                </div>
              </section>

              {/* Lead Information */}
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BriefcaseBusiness
                    size={18}
                    className="text-[#074977]"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Lead Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <LeadInfo
                    icon={Building2}
                    label="Product"
                    value={detail.product}
                    iconClass="text-indigo-600"
                    bgClass="bg-indigo-100"
                  />

                  <LeadInfo
                    icon={IndianRupee}
                    label="Price Range"
                    value={formatCurrency(
                      detail.priceRange
                    )}
                    iconClass="text-green-600"
                    bgClass="bg-green-100"
                  />

                  <LeadInfo
                    icon={CircleDollarSign}
                    label="Deal Value"
                    value={formatCurrency(
                      detail.dealValue
                    )}
                    iconClass="text-green-600"
                    bgClass="bg-green-100"
                  />

                  <LeadInfo
                    icon={Tag}
                    label="Source"
                    value={getSourceLabel(
                      detail.source
                    )}
                    iconClass="text-blue-600"
                    bgClass="bg-blue-100"
                  />

                  <LeadInfo
                    icon={Activity}
                    label="Stage"
                    value={getStageLabel(
                      detail.stage
                    )}
                    iconClass="text-violet-600"
                    bgClass="bg-violet-100"
                  />

                  <LeadInfo
                    icon={Activity}
                    label="Status"
                    value={detail.status}
                    iconClass="text-cyan-600"
                    bgClass="bg-cyan-100"
                  />

                  <LeadInfo
                    icon={CalendarDays}
                    label="Expected Closure Date"
                    value={formatDate(
                      detail.expectedClosureDate
                    )}
                    iconClass="text-orange-600"
                    bgClass="bg-orange-100"
                  />
                </div>
              </section>

              {/* Campaign / Meta */}
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Megaphone
                    size={18}
                    className="text-[#074977]"
                  />

                  <h3 className="font-semibold text-gray-800">
                    Campaign & Source
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <LeadInfo
                    icon={Hash}
                    label="Meta Lead ID"
                    value={detail.metaLeadId}
                    iconClass="text-blue-600"
                    bgClass="bg-blue-100"
                  />

                  <LeadInfo
                    icon={Hash}
                    label="Campaign ID"
                    value={detail.campaignId}
                    iconClass="text-purple-600"
                    bgClass="bg-purple-100"
                  />

                  <LeadInfo
                    icon={Megaphone}
                    label="Campaign Name"
                    value={detail.campaignName}
                    iconClass="text-orange-600"
                    bgClass="bg-orange-100"
                  />

                  {detail.platform && (
                    <LeadInfo
                      icon={Globe}
                      label="Platform"
                      value={detail.platform}
                      iconClass="text-[#074977]"
                      bgClass="bg-[#074977]/10"
                    />
                  )}

                  {detail.platformEmail && (
                    <LeadInfo
                      icon={Mail}
                      label="Platform Email"
                      value={detail.platformEmail}
                      iconClass="text-blue-600"
                      bgClass="bg-blue-100"
                    />
                  )}
                </div>
              </section>

              {/* Message */}
              {detail.message && (
                <section className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare
                      size={18}
                      className="text-[#074977]"
                    />

                    <h3 className="font-semibold text-gray-800">
                      Message
                    </h3>
                  </div>

                  <div className="rounded-xl border border-[#074977]/10 bg-gradient-to-br from-[#074977]/5 to-[#D01132]/5 px-4 py-4">
                    <p className="text-sm text-gray-700 leading-7 whitespace-pre-wrap">
                      {detail.message}
                    </p>
                  </div>
                </section>
              )}

              {/* System Information */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Activity
                    size={18}
                    className="text-[#074977]"
                  />

                  <h3 className="font-semibold text-gray-800">
                    System Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <LeadInfo
                    icon={Hash}
                    label="Lead ID"
                    value={detail._id}
                    iconClass="text-gray-600"
                    bgClass="bg-gray-100"
                  />

                  <LeadInfo
                    icon={User}
                    label="User ID"
                    value={
                      typeof detail.userId ===
                        "object"
                        ? detail.userId?._id
                        : detail.userId
                    }
                    iconClass="text-gray-600"
                    bgClass="bg-gray-100"
                  />

                  <LeadInfo
                    icon={CalendarDays}
                    label="Created At"
                    value={formatDateTime(
                      detail.createdAt
                    )}
                    iconClass="text-blue-600"
                    bgClass="bg-blue-100"
                  />

                  <LeadInfo
                    icon={CalendarDays}
                    label="Last Updated"
                    value={formatDateTime(
                      detail.updatedAt
                    )}
                    iconClass="text-green-600"
                    bgClass="bg-green-100"
                  />
                </div>
              </section>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setDetails(null)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              <X size={17} />
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}