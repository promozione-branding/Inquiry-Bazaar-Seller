"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  Package,
  Settings,
  Menu,
  X,
  CircleQuestionMark,
  LayoutPanelTop,
  Headset,
} from "lucide-react";

export default function SupplierSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Leads", icon: Headset, path: "/leads" },
    { name: "Website Page", icon: LayoutPanelTop, path: "/website-page" },
    { name: "Help", icon: CircleQuestionMark, path: "/help" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-300 shadow-sm h-screen fixed md:static top-0 left-0 z-40
        transition-all duration-300 ${open ? "w-60" : "w-16"} md:w-60`}>
        <nav className="mt-18 md:mt-4 px-2 space-y-2">
          <div className={`flex md:hidden ${open ? "justify-end" : "justify-start"} w-full`}>
            <button className="md:hidden top-4 left-4 z-50 bg-black text-white px-2.5 py-3 rounded-md"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {menu.map((item, i) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link key={i} href={item.path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition
                ${active
                    ? "bg-blue-100 text-[#0a5183] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon size={20} />

                {/* Text logic */}
                <span className={`${open ? "block" : "hidden"} md:block`}>
                  {item.name}
                </span>

              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}