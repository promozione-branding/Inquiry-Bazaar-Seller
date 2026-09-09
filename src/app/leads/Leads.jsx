"use client";

import TrackLeads from "@/components/Supplier/Leads/TrackLeads";
import InquiryLeads from "@/components/Supplier/Leads/InquiryLeads";
import { LayoutGrid, Search, Table, Plus, Download, MoreVertical, RefreshCcw, X, Upload, MousePointerClick, MessageSquare, } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { format, startOfDay, endOfDay } from "date-fns";
import MyDateRangePicker from "@/components/Inputs/Datepicker";
import { useRouter } from "next/navigation";

export default function Leads() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [switchButton, setSwitchButton] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState("today");
    const [range, setRange] = useState(() => {
        const today = new Date();

        return {
            startDate: startOfDay(today),
            endDate: endOfDay(today),
        };
    });
    const [search, setSearch] = useState("");
    const [view, setView] = useState("table");
    const [trackingData, setTrackingData] = useState([]);
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const getDateFilter = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return "today";
        }

        const selectedStart = format(
            startDate,
            "yyyy-MM-dd"
        );

        const selectedEnd = format(
            endDate,
            "yyyy-MM-dd"
        );

        const today = format(
            new Date(),
            "yyyy-MM-dd"
        );

        const yesterdayDate = new Date();

        yesterdayDate.setDate(
            yesterdayDate.getDate() - 1
        );

        const yesterday = format(
            yesterdayDate,
            "yyyy-MM-dd"
        );

        // Today
        if (selectedStart === today && selectedEnd === today) {
            return "today";
        }

        // Yesterday
        if (
            selectedStart === yesterday &&
            selectedEnd === yesterday
        ) {
            return "yesterday";
        }

        // Custom range
        return "custom";
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [
        filter,
        search,
        switchButton,
        range.startDate,
        range.endDate,
    ]);

    useEffect(() => {
        if (!user?._id || switchButton) {
            return;
        }

        const fetchInquiryLeads = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/api/leads/all",
                    {
                        params: {
                            page: currentPage,
                            limit: limit,

                            filter,

                            startDate: format(
                                range.startDate,
                                "yyyy-MM-dd"
                            ),

                            endDate: format(
                                range.endDate,
                                "yyyy-MM-dd"
                            ),

                            search: search.trim(),
                        },

                        withCredentials: true,
                    }
                );

                if (response.data.success) {
                    setLeadsData(response.data.data || []);

                    setPagination(
                        response.data.pagination || {
                            page: currentPage,
                            limit,
                            total: 0,
                            totalPages: 0,
                            hasNextPage: false,
                            hasPrevPage: false,
                        }
                    );
                }
            } catch (error) {
                console.error("Error fetching inquiry leads:", error);
                setLeadsData([]);

                setPagination({
                    page: 1,
                    limit,
                    total: 0,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                });

                if (error.response?.status === 401) {
                    console.log("Unauthorized");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchInquiryLeads();
    }, [
        user?._id,
        filter,
        range.startDate,
        range.endDate,
        search,
        currentPage,
        limit,
        switchButton,
    ]);

    useEffect(() => {
        if (!user?._id || !switchButton) {
            return;
        }

        const fetchTrackLeads = async () => {
            try {
                setLoading(true);
                const params = {
                    filter,

                    startDate: format(
                        range.startDate,
                        "yyyy-MM-dd"
                    ),

                    endDate: format(
                        range.endDate,
                        "yyyy-MM-dd"
                    ),
                };

                const response = await axios.get(`${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/tracking/events/supplier/${user._id}`,
                    { params, }
                );

                if (response.data.success) {
                    setTrackingData(response.data.data || []);
                } else {
                    setTrackingData([]);
                }
            } catch (error) {
                console.error("Error fetching tracking leads:", error);
                setTrackingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrackLeads();
    }, [user?._id, filter, range.startDate, range.endDate, switchButton,]);

    const handleDateChange = (selection) => {
        if (
            !selection?.startDate ||
            !selection?.endDate
        ) {
            return;
        }

        const startDate = startOfDay(
            selection.startDate
        );

        const endDate = endOfDay(
            selection.endDate
        );

        setRange({
            startDate,
            endDate,
        });

        // Automatically determine:
        // today / yesterday / custom
        const newFilter = getDateFilter(
            startDate,
            endDate
        );

        setFilter(newFilter);
    };

    const exportLeads = () => {
        if (!leadsData?.length) {
            alert("No leads available to export.");
            return;
        }

        const headers = [
            "Name",
            "Phone",
            "Email",
            "Company Name",
            "GST Number",
            "Place",
            "Product",
            "Message",
            "Price Range",
            "Deal Value",
            "Expected Closure Date",
            "Source",
            "Stage",
            "Status",
            "Campaign ID",
            "Campaign Name",
            "Meta Lead ID",
            "Created At",
        ];

        const escapeCsv = (value) => {
            if (value === null || value === undefined) {
                return "";
            }

            return `"${String(value)
                .replace(/"/g, '""')
                .replace(/\r?\n|\r/g, " ")}"`;
        };

        const formatValue = (value) => {
            if (value === null || value === undefined || value === "") {
                return "";
            }

            return String(value);
        };

        const rows = leadsData.map((lead) => [
            formatValue(lead.name),
            formatValue(lead.phone),
            formatValue(lead.email),
            formatValue(lead.companyName),
            formatValue(lead.gstNumber),
            formatValue(lead.place),
            formatValue(lead.product),
            formatValue(lead.message),
            formatValue(lead.priceRange),
            formatValue(lead.dealValue),

            lead.expectedClosureDate
                ? format(new Date(lead.expectedClosureDate), "dd-MM-yyyy")
                : "",

            formatValue(lead.source),
            formatValue(lead.stage),
            formatValue(lead.status),
            formatValue(lead.campaignId),
            formatValue(lead.campaignName),
            formatValue(lead.metaLeadId),

            lead.createdAt
                ? format(new Date(lead.createdAt), "dd-MM-yyyy HH:mm:ss")
                : "",
        ]);

        const csvContent = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(",")),
        ].join("\r\n");

        // UTF-8 BOM helps Excel correctly recognize UTF-8 CSV files
        const blob = new Blob(
            ["\uFEFF" + csvContent],
            {
                type: "text/csv;charset=utf-8;",
            }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setMoreMenuOpen(false);
    };

    const SkeletonCard = () => (
        <div className="rounded-xl p-2 animate-pulse">
            <div className="bg-white rounded-xl p-4 h-full shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>

                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>

                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>

                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>

                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>

                    <div className="h-4 bg-gray-200 rounded w-3/6"></div>
                </div>

                <div className="mt-5 p-3 border rounded-lg border-gray-300">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>

                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>

                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="md:p-4 p-3 bg-gray-100 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hiden">
                <div className="p-3 md:p-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <div className="flex justify-between items-center gap-2 min-w-0">
                            <div className="min-w-0">
                                <h2 className="text-lg font-bold text-gray-800 whitespace-nowrap">
                                    {switchButton
                                        ? "Track Clicks"
                                        : "Inquiry Leads"}
                                </h2>

                                <p className="text-xs text-gray-500 truncate">
                                    {switchButton
                                        ? `${trackingData.length} total clicks`
                                        : `${pagination.total} total leads`}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button type="button"
                                    onClick={() => setView(view === "table" ? "card" : "table")}
                                    title={view === "table" ? "Card View" : "Table View"}
                                    className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[#074977] text-white hover:opacity-90 transition"
                                >
                                    {view === "table" ? (
                                        <LayoutGrid size={16} />
                                    ) : (
                                        <Table size={16} />
                                    )}
                                </button>

                                <div className="relative shrink-0 flex md:hidden">
                                    <button type="button" title="More options"
                                        onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg border transition ${moreMenuOpen
                                            ? "bg-gray-100 border-gray-400 text-gray-800"
                                            : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {moreMenuOpen && (
                                        <>
                                            {/* BACKDROP */}
                                            <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />

                                            {/* MENU */}
                                            <div className="absolute right-0 top-11 z-50 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                                <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                                    Leads
                                                </div>

                                                {/* INQUIRY LEADS */}
                                                <button type="button"
                                                    onClick={() => { setSwitchButton(false); setMoreMenuOpen(false); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${!switchButton
                                                        ? "bg-blue-50 text-blue-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <MessageSquare
                                                        size={17}
                                                        className={!switchButton ? "text-blue-600" : "text-gray-500"}
                                                    />

                                                    <div className="flex-1 text-left">
                                                        <p className="font-medium">
                                                            Inquiry Leads
                                                        </p>
                                                    </div>

                                                    {!switchButton && (
                                                        <span className="text-blue-600 text-xs font-semibold">
                                                            Active
                                                        </span>
                                                    )}
                                                </button>

                                                {/* TRACK CLICKS */}
                                                <button type="button"
                                                    onClick={() => { setSwitchButton(true); setMoreMenuOpen(false); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${switchButton
                                                        ? "bg-green-50 text-green-700"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <MousePointerClick
                                                        size={17}
                                                        className={switchButton ? "text-green-600" : "text-gray-500"}
                                                    />

                                                    <div className="flex-1 text-left">
                                                        <p className="font-medium">
                                                            Track Clicks
                                                        </p>
                                                    </div>

                                                    {switchButton && (
                                                        <span className="text-green-600 text-xs font-semibold">
                                                            Active
                                                        </span>
                                                    )}
                                                </button>

                                                <div className="border-t border-gray-100" />

                                                {/* ACTIONS */}
                                                <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                                    Actions
                                                </div>

                                                <button type="button"
                                                    onClick={() => { setMoreMenuOpen(false); router.push("/leads/add"); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    <Plus size={17} className="text-[#074977]" />

                                                    <div className="text-left">
                                                        <p className="font-medium">
                                                            Add Lead
                                                        </p>
                                                    </div>
                                                </button>

                                                {/* EXPORT */}
                                                <button type="button" onClick={exportLeads}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                                >
                                                    <Download
                                                        size={17}
                                                        className="text-green-600"
                                                    />

                                                    <div className="text-left">
                                                        <p className="font-medium">
                                                            Export
                                                        </p>
                                                    </div>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 sm:ml-auto sm:w-auto">
                            {/* MORE MENU */}
                            <div className="relative shrink-0 hidden md:flex">
                                <button type="button" title="More options"
                                    onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                                    className={`flex items-center justify-center w-9 h-9 rounded-lg border transition ${moreMenuOpen
                                        ? "bg-gray-100 border-gray-400 text-gray-800"
                                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {moreMenuOpen && (
                                    <>
                                        {/* BACKDROP */}
                                        <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />

                                        {/* MENU */}
                                        <div className="absolute right-0 top-11 z-50 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                            <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                                Leads
                                            </div>

                                            {/* INQUIRY LEADS */}
                                            <button type="button"
                                                onClick={() => { setSwitchButton(false); setMoreMenuOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${!switchButton
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <MessageSquare
                                                    size={17}
                                                    className={!switchButton ? "text-blue-600" : "text-gray-500"}
                                                />

                                                <div className="flex-1 text-left">
                                                    <p className="font-medium">
                                                        Inquiry Leads
                                                    </p>
                                                </div>

                                                {!switchButton && (
                                                    <span className="text-blue-600 text-xs font-semibold">
                                                        Active
                                                    </span>
                                                )}
                                            </button>

                                            {/* TRACK CLICKS */}
                                            <button type="button"
                                                onClick={() => { setSwitchButton(true); setMoreMenuOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${switchButton
                                                    ? "bg-green-50 text-green-700"
                                                    : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <MousePointerClick
                                                    size={17}
                                                    className={switchButton ? "text-green-600" : "text-gray-500"}
                                                />

                                                <div className="flex-1 text-left">
                                                    <p className="font-medium">
                                                        Track Clicks
                                                    </p>
                                                </div>

                                                {switchButton && (
                                                    <span className="text-green-600 text-xs font-semibold">
                                                        Active
                                                    </span>
                                                )}
                                            </button>

                                            <div className="border-t border-gray-100" />

                                            {/* ACTIONS */}
                                            <div className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                                Actions
                                            </div>

                                            <button type="button"
                                                onClick={() => { setMoreMenuOpen(false); router.push("/leads/add"); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                <Plus size={17} className="text-[#074977]" />

                                                <div className="text-left">
                                                    <p className="font-medium">
                                                        Add Lead
                                                    </p>
                                                </div>
                                            </button>

                                            {/* EXPORT */}
                                            <button type="button" onClick={exportLeads}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                                            >
                                                <Download
                                                    size={17}
                                                    className="text-green-600"
                                                />

                                                <div className="text-left">
                                                    <p className="font-medium">
                                                        Export
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* DATE */}
                            <div className="shrink-0">
                                <MyDateRangePicker
                                    value={range}
                                    open={open}
                                    setOpen={setOpen}
                                    onChange={handleDateChange}
                                />
                            </div>

                            {/* SEARCH */}
                            <div className="relative w-full overflow-hidden sm:w-60">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search leads..."
                                    className="input text-xs sm:text-base pl-9! w-full px-2 py-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                {switchButton ? (
                    <TrackLeads
                        loading={loading}
                        user={user}
                        filter={filter}
                        startDate={range.startDate}
                        endDate={range.endDate}
                        search={search}
                        view={view}
                        trackingData={trackingData}
                        SkeletonCard={SkeletonCard}
                    />
                ) : (
                    <InquiryLeads
                        loading={loading}
                        user={user}
                        filter={filter}
                        startDate={range.startDate}
                        endDate={range.endDate}
                        search={search}
                        view={view}
                        leadsData={leadsData}
                        SkeletonCard={SkeletonCard}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pagination={pagination}
                        limit={limit}
                        setLimit={setLimit}
                    />
                )}
            </div>
        </div>
    );
}