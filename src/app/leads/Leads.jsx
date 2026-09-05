"use client";

import FilterSidebar from "@/components/Supplier/Leads/FilterSidebar";
import TrackLeads from "@/components/Supplier/Leads/TrackLeads";
import InquiryLeads from "@/components/Supplier/Leads/InquiryLeads";
import {
    Filter,
    LayoutGrid,
    Search,
    Table,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Leads() {
    const [open, setOpen] = useState(false);
    const [switchButton, setSwitchButton] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [filter, setFilter] = useState("today");
    const [search, setSearch] = useState("");
    const [view, setView] = useState("table");
    const [trackingData, setTrackingData] = useState([]);
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Pagination
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

    // --------------------------------
    // Reset page when filter/search changes
    // --------------------------------
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, search, switchButton]);

   useEffect(() => {
    if (!user?._id || switchButton) {
        return;
    }

    const fetchInquiryLeads = async () => {
        try {
            setLoading(true);

            const response = await axios.get("/api/leads/all", {
                params: {
                    page: currentPage,
                    limit: limit,
                    filter,
                    search: search.trim(),
                },
                withCredentials: true,
            });

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
            console.error(
                "Error fetching inquiry leads:",
                error
            );

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
    search,
    currentPage,
    limit,
    switchButton,
]);

    // --------------------------------
    // Fetch Tracking Leads
    // --------------------------------
    useEffect(() => {
        if (!user?._id || !switchButton) {
            return;
        }

        const fetchTrackLeads = async () => {
            try {
                setLoading(true);

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/tracking/events/supplier/${user._id}`,
                    {
                        params: {
                            filter,
                        },
                    }
                );

                if (response.data.success) {
                    setTrackingData(response.data.data || []);
                }
            } catch (error) {
                console.error(
                    "Error fetching tracking leads:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTrackLeads();
    }, [user?._id, filter, switchButton]);

    // --------------------------------
    // Skeleton
    // --------------------------------
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* HEADER */}
                <div className="p-2 md:p-5 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex gap-1 items-center">
                                    Inquiry

                                    <button
                                        onClick={() =>
                                            setView(
                                                view === "table"
                                                    ? "card"
                                                    : "table"
                                            )
                                        }
                                        className="flex items-center gap-2 p-2 rounded-md bg-[#074977] text-white hover:opacity-90"
                                    >
                                        {view === "table" ? (
                                            <LayoutGrid size={16} />
                                        ) : (
                                            <Table size={16} />
                                        )}
                                    </button>
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Total Inquiry:{" "}
                                    {switchButton
                                        ? trackingData.length
                                        : pagination.total}
                                </p>
                            </div>

                            {/* MOBILE SWITCH */}
                            <div className="md:hidden flex items-center bg-gray-100 p-1 rounded-xl w-fit shadow-sm">
                                <button
                                    onClick={() =>
                                        setSwitchButton(false)
                                    }
                                    className={`px-2 py-2 rounded-lg text-xs font-medium text-nowrap transition-all ${!switchButton
                                        ? "bg-white shadow text-blue-600"
                                        : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    Inquiry Leads
                                </button>

                                <button
                                    onClick={() =>
                                        setSwitchButton(true)
                                    }
                                    className={`px-2 py-2 rounded-lg text-xs font-medium text-nowrap transition-all ${switchButton
                                        ? "bg-white shadow text-green-600"
                                        : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    Track Clicks
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">

                            {/* DESKTOP SWITCH */}
                            <div className="hidden md:flex items-center bg-gray-100 p-1 rounded-xl w-fit shadow-sm">
                                <button onClick={() => setSwitchButton(false)}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium text-nowrap transition-all ${!switchButton
                                        ? "bg-white shadow text-blue-600"
                                        : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    Inquiry Leads
                                </button>

                                <button onClick={() => setSwitchButton(true)}
                                    className={`px-5 py-2 rounded-lg text-sm font-medium text-nowrap transition-all ${switchButton
                                        ? "bg-white shadow text-green-600"
                                        : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    Track Clicks
                                </button>
                            </div>

                            {/* DATE FILTER */}
                            <select value={filter} onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="today">
                                    Today
                                </option>

                                <option value="yesterday">
                                    Yesterday
                                </option>

                                <option value="7days">
                                    Last 7 Days
                                </option>

                                <option value="30days">
                                    Last 30 Days
                                </option>

                                <option value="all">
                                    All Time
                                </option>
                            </select>

                            {/* SEARCH */}
                            <div className="relative w-full">
                                <Search
                                    size={18}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="input pl-8!"
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

            <FilterSidebar
                open={open}
                setOpen={setOpen}
            />
        </div>
    );
}