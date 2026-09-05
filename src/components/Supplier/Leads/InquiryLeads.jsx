import React, { useState, useMemo, useEffect } from 'react'
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
  Edit,
  Eye,
} from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import Modal from '@/components/Modal/Modal';

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
}) {

  const [detail, setDetails] = useState(false);

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
                  Phone
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">
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
                  <tr key={index} className="border-t border-gray-200">
                    {[...Array(6)].map((_, i) => (
                      <td key={i} className="px-4 py-5">
                        <div className="h-5 bg-gray-200 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : leadsData?.length > 0 ? (
                leadsData.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className={`border-t border-gray-100 hover:bg-blue-50/40 transition ${index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/40"
                      }`}
                  >
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
                          <h4 className="font-semibold text-gray-800 truncate">
                            {lead.name}
                          </h4>

                          <div className="flex items-center gap-1 mt-1">
                            <Globe
                              size={12}
                              className="text-[#074977]"
                            />

                            <span className="text-xs text-gray-500 truncate">
                              {lead.platform?.replace(
                                "https://",
                                ""
                              ) || "-"}
                            </span>
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* PRODUCT */}
                    <td className="px-2 py-2">

                      {lead.product ? (
                        <div className="flex items-center gap-2">

                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Building2
                              size={16}
                              className="text-indigo-600"
                            />
                          </div>

                          <div>
                            <p className="font-medium line-clamp-1 w-60">
                              {lead.product}
                            </p>
                          </div>

                        </div>
                      ) : (
                        "-"
                      )}

                    </td>

                    {/* PHONE */}
                    <td className="px-2 py-2">

                      <div className="flex items-center gap-2">

                        <Phone
                          size={14}
                          className="text-[#D01132]"
                        />

                        <span>
                          {lead.phone}
                        </span>

                      </div>

                    </td>

                    {/* EMAIL */}
                    <td className="px-2 py-2">

                      <div className="space-y-1">

                        {lead.email && (

                          <p className="truncate">
                            {lead.email}
                          </p>
                        )}

                      </div>

                    </td>

                    {/* TIME */}
                    <td className="px-2 py-2" >

                      <div>

                        <p>
                          {new Date(
                            lead.createdAt
                          ).toLocaleDateString()}
                        </p>

                        <p className="text-xs text-gray-500">
                          {new Date(
                            lead.createdAt
                          ).toLocaleTimeString()}
                        </p>

                      </div>

                    </td>

                    {/* ACTIONS */}
                    <td className="px-2 py-2">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => setDetails(lead)}
                          className="w-10 h-10 rounded-xl bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition"
                        >
                          <Eye
                            size={20}
                            className="text-blue-600"
                          />
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `tel:${lead.phone}`
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
                                lead.whatsapp ||
                                lead.phone
                              ).replace(/\D/g, "")}`,
                              "_blank"
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition"
                        >
                          <FaWhatsapp
                            size={23}
                            className="text-green-600"
                          />
                        </button>
                      </div>
                    </td>
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
                        Buyer tracking activity will appear here
                      </p>

                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div >}

      {view == "card" &&
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 px-2">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : leadsData?.length > 0 ? (
            leadsData.map((lead, index) => (
              <motion.div key={index}
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
                          {lead.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-0.5">
                          <Globe
                            size={13}
                            className="text-[#074977]"
                          />

                          <p className="text-sm text-gray-500 truncate">
                            {lead.platform?.replace("https://", "")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => window.open(`tel:${lead.phone}`)}
                        className="w-10 h-10 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center transition shrink-0"
                      >
                        <Phone size={20} className="text-[#D01132]" />
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            `https://wa.me/${String(
                              lead.whatsapp || lead.phone,
                            ).replace(/\D/g, "")}`,
                            "_blank",
                          )
                        }
                        className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition shrink-0"
                      >
                        <FaWhatsapp size={23} className="text-green-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2.5 space-y-3">
                  <div className="space-y-2.5">
                    {lead.platformEmail && (
                      <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-xl px-4 py-2">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                          <Mail
                            size={17}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-800 mb-0.5">
                            Platform Email
                          </p>

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {lead.platformEmail}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-red-50 transition rounded-xl px-4 py-2">
                      <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                        <Phone
                          size={17}
                          className="text-[#D01132]"
                        />
                      </div>

                      <div>
                        <p className="text-xs text-gray-800 mb-0.5">
                          Phone
                        </p>

                        <p className="text-sm font-medium text-gray-800">
                          {lead.phone}
                        </p>
                      </div>
                    </div>

                    {lead.email && (
                      <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-cyan-50 transition rounded-xl px-4 py-2">
                        <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                          <Mail
                            size={17}
                            className="text-cyan-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-800 mb-0.5">
                            User Email
                          </p>

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {lead.place && (
                      <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-orange-50 transition rounded-xl px-4 py-2">
                        <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                          <MapPin
                            size={17}
                            className="text-orange-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-800 mb-0.5">
                            Location
                          </p>

                          <p className="text-sm font-medium text-gray-800">
                            {lead.place}
                          </p>
                        </div>
                      </div>
                    )}

                    {lead.priceRange && (
                      <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-xl px-4 py-2">
                        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                          <IndianRupee
                            size={17}
                            className="text-green-600"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-800 mb-0.5">
                            Budget
                          </p>

                          <p className="text-sm font-medium text-gray-800">
                            {lead.priceRange}
                          </p>
                        </div>
                      </div>
                    )}

                    {lead.product && (
                      <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-indigo-50 transition rounded-xl px-4 py-2">
                        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                          <Building2
                            size={17}
                            className="text-indigo-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-800 mb-0.5">
                            Product
                          </p>

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {lead.product}
                          </p>
                        </div>
                      </div>
                    )}
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

                      <p className="text-sm text-gray-600 leading-6">
                        {lead.message}
                      </p>
                    </div>
                  )}
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

      {/* PAGINATION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-white">

        {/* LEFT */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* SHOWING */}
          <p className="text-sm text-gray-500 whitespace-nowrap">
            {pagination?.total > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {(currentPage - 1) * limit + 1}
                </span>
                {" "}to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    currentPage * limit,
                    pagination.total
                  )}
                </span>
                {" "}of{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.total}
                </span>
                {" "}Inquiry
              </>
            ) : (
              "No Inquiry"
            )}
          </p>

          {/* ITEMS PER PAGE */}
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

        {/* RIGHT - PAGINATION */}
        {pagination?.totalPages > 1 && (
          <div className="flex items-center gap-2">

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={() => {
                if (pagination.hasPrevPage && !loading) {
                  setCurrentPage((page) => page - 1);
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

            {/* PAGE NUMBERS */}
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
                            text-sm font-medium
                            transition
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

            {/* NEXT */}
            <button
              type="button"
              onClick={() => {
                if (
                  pagination.hasNextPage &&
                  !loading
                ) {
                  setCurrentPage((page) => page + 1);
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

      <Modal open={detail} onClose={() => setDetails(false)}>
        <Modal.Header title="Lead Details" />
        <Modal.Body>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }} transition={{ duration: 0.25 }}
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
                      {detail?.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-0.5">
                      <Globe
                        size={13}
                        className="text-[#074977]"
                      />

                      <p className="text-sm text-gray-500 truncate">
                        {detail?.platform?.replace("https://", "")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(`tel:${detail?.phone}`)}
                    className="w-10 h-10 rounded-xl bg-[#D01132]/10 hover:bg-[#D01132]/20 flex items-center justify-center transition shrink-0"
                  >
                    <Phone size={20} className="text-[#D01132]" />
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${String(
                          detail?.whatsapp || detail?.phone,
                        ).replace(/\D/g, "")}`,
                        "_blank",
                      )
                    }
                    className="w-10 h-10 rounded-xl bg-green-100 hover:bg-green-200 flex items-center justify-center transition shrink-0"
                  >
                    <FaWhatsapp size={23} className="text-green-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 space-y-3">
              <div className="space-y-2.5">
                {detail?.platformEmail && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail
                        size={17}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        Platform Email
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {detail?.platformEmail}
                      </p>
                    </div>
                  </div>
                )}

                <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-red-50 transition rounded-xl px-4 py-2">
                  <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <Phone
                      size={17}
                      className="text-[#D01132]"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-800 mb-0.5">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {detail?.phone}
                    </p>
                  </div>
                </div>

                {detail.email && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-cyan-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
                      <Mail
                        size={17}
                        className="text-cyan-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        User Email
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {detail?.email}
                      </p>
                    </div>
                  </div>
                )}

                {detail?.place && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-orange-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <MapPin
                        size={17}
                        className="text-orange-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-800 mb-0.5">
                        Location
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {detail?.place}
                      </p>
                    </div>
                  </div>
                )}

                {detail?.priceRange && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-green-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                      <IndianRupee
                        size={17}
                        className="text-green-600"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-800 mb-0.5">
                        Budget
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {detail?.priceRange}
                      </p>
                    </div>
                  </div>
                )}

                {detail?.product && (
                  <div className="border border-gray-100 flex items-center gap-3 bg-gray-50 hover:bg-indigo-50 transition rounded-xl px-4 py-2">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                      <Building2
                        size={17}
                        className="text-indigo-600"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-800 mb-0.5">
                        Product
                      </p>

                      <p className="text-sm font-medium text-gray-800 truncate">
                        {detail?.product}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {detail?.message && (
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

                  <p className="text-sm text-gray-600 leading-6">
                    {detail?.message}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </Modal.Body>
        {/* <Modal.Footer>
          <div className='flex justify-end gap-2'>
            <button onClick={""} className="border border-gray-300 px-4 py-2 rounded-md text-black bg-gray-100 hover:bg-gray-200">
              Close
            </button>
          </div>
        </Modal.Footer> */}
      </Modal>
    </div>
  )
}