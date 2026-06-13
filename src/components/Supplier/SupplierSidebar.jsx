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
      <button onClick={() => setOpen(true)}
        className="md:hidden fixed top-6 left-2 z-50 bg-gray-200 border border-gray-300 text-black p-2 rounded-md"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-300 shadow-sm h-screen fixed md:static top-0 left-0 z-50 md:z-40
        transition-all duration-300  ${open ? "translate-x-0" : "-translate-x-full"}  md:translate-x-0 w-60`}>
          
        <div className="flex justify-end p-3 md:hidden">
          <button onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-2 space-y-2">
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