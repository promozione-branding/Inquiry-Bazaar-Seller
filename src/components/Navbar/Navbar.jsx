"use client";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Menu, X, User, LogOut, Bell, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await axios.post("/api/auth/logout");
    dispatch(logout());
    router.push("/");
    setProfileOpen(false)
  };

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

  return (
    <nav className="w-full border-b border-b-gray-300 bg-white sticky top-0 z-50 h-20">
      <div className="mx-auto md:px-6 px-2 flex items-center justify-between">
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
                <div className="absolute right-0 mt-1 w-70 bg-white shadow-lg rounded-lg border border-gray-300">
                  <div className="p-4 border-b border-b-gray-300">
                    <p className="font-semibold text-black text-center">No Notification yet.</p>
                  </div>
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