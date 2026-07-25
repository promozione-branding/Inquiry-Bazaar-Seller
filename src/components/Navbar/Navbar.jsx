"use client";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X, User, LogOut, Bell, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { FiBell, FiShoppingBag, FiUser } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [businessDetails, setBusinessDetails] = useState(null);

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    dispatch(logout());
    await router.push("/");
    window.location.reload();
    setProfileOpen(false)
  };

  const fetchBusiness = async () => {
    try {
      const res = await axios.get(`/api/webpage/${user?._id}`);
      // console.log(res.data)
      if (res.data) {
        setBusinessDetails(res.data)
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBusiness()
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);

        const todayRes = await axios.get(
          `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=today`
        );

        if (todayRes.data.success && todayRes.data.data?.length > 0) {
          setLeadsData(todayRes.data.data);
          return;
        }

        const previousRes = await axios.get(
          `${process.env.NEXT_PUBLIC_LEAD_BACKEND_BASE_URL}/api/form/get-forms/${user?._id}?filter=all`
        );

        if (previousRes.data.success) {
          setLeadsData(previousRes.data.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) {
      fetchLeads();
    }
  }, [user]);

  // console.log(businessDetails)

  return (
    <nav className="w-full border-b border-b-gray-300 bg-white sticky top-0 z-50 h-20">
      <div className="mx-auto md:px-6 px-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/Logo/logoo.webp"
            alt="Inquiry Bazaar"
            width={200}
            height={200}
            className="object-contain h-19 w-50"
          />
        </Link>
        {user ? (<>
          <div className="flex gap-2 items-center">
            <div className="relative" ref={bellRef}>
              <button onClick={() => setBellOpen(!bellOpen)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-black">
                <Bell size={20} />
              </button>

              {bellOpen && (
                <div className="absolute -right-6 sm:right-0 mt-1 sm:mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300">
                    <div className="flex items-center gap-2">
                      <FiBell className="text-blue-600 text-lg" />
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>

                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {leadsData.length}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-6 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : leadsData.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                        <FiBell className="text-4xl mb-2 text-gray-300" />
                        <p>No notifications yet.</p>
                      </div>
                    ) : (
                      leadsData.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-2 p-2 border-b border-gray-200 hover:bg-blue-50 transition cursor-pointer"
                        >
                          {/* Icon */}
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FiShoppingBag className="text-blue-600 text-sm" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-sm text-gray-800 capitalize flex items-center gap-1">
                                  <FiUser className="text-gray-500" />
                                  {item.name}
                                </h4>

                                <p className="text-xs text-gray-700 mt-1 line-clamp-1">
                                  Interested in {item.product}
                                </p>
                              </div>

                              <span className="text-[10px] text-gray-600 whitespace-nowrap">
                                {new Date(item.createdAt).toLocaleString([], {
                                  day: "2-digit",
                                  month: "short",
                                  // year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {leadsData.length > 0 && (
                    <div className="p-3 text-center border-t border-gray-300 bg-gray-50">
                      <button className="text-blue-600 text-sm font-medium hover:underline">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-black" >
                <User size={25} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-1 w-70 bg-white shadow-lg rounded-lg border border-gray-300">
                  <div className="p-4 border-b border-b-gray-300">
                    <p className="font-semibold text-black text-center">{user?.name}</p>
                    <p className="text-sm text-gray-800 text-center">{user?.email}</p>
                  </div>
                  <button onClick={() => { router.push(`/dashboard`); setProfileOpen(false) }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-black">
                    Dashboard
                  </button>

                  {businessDetails?.slug &&
                    <a href={`https://dir.inquirybazaar.com/${businessDetails?.slug}`} target="blank" className="block  w-full px-4 py-2 text-left hover:bg-gray-100 text-black">
                      View Catalog
                    </a>}

                  <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-100 flex items-center gap-2">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </>) : (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/register" className="flex items-center gap-1 px-4 py-2 text-white rounded-lg bg-[#f45a06] hover:bg-[#e45407]">
                Register Free <ArrowUpRight size={18} />
              </Link>

              <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <LogIn size={18} />
                Sign In
              </Link>
            </div>

            <button className="md:hidden bg-[#1e3a5f] text-white px-3 py-2 rounded-md" onClick={() => setOpen(!open)}>
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {!user && open && (
        <div className="absolute w-full md:hidden px-6 py-3 flex flex-col gap-3 bg-white border-t">
          <Link href="/register" className="px-4 py-3 text-white bg-[#f45a06] rounded-lg">
            Register
          </Link>

          <Link href="/login" className="flex justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <LogIn size={18} />
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}