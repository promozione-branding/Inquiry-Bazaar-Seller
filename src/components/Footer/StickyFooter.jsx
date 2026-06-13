"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    User,
    Package,
    PhoneCall,
    Settings,
} from "lucide-react";
import { useSelector } from "react-redux";

const Stickyfooter = () => {
    const { user } = useSelector((state) => state.auth);
    if (!user) return

    const pathname = usePathname();
    const menus = [
        { href: "/dashboard", label: "Home", icon: House },
        { href: "/profile", label: "Profile", icon: User },
        { href: "/leads", label: "Leads", icon: PhoneCall, center: true },
        { href: "/products", label: "Products", icon: Package },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white border-t rounded-t-3xl shadow-xl px-3 pt-2 pb-2">

                <div className="grid grid-cols-5 items-end">

                    {menus.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href;

                        if (item.center) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`
                      -mt-8
                      w-16 h-16
                      rounded-full
                      flex items-center justify-center
                      shadow-lg border-4 border-white
                      transition-all
                      ${active
                                                ? "bg-blue-600 text-white"
                                                : "bg-black text-white"
                                            }
                    `}
                                    >
                                        <Icon size={26} />
                                    </div>

                                    <span
                                        className={`
                      text-xs mt-1
                      ${active ? "text-blue-600" : "text-gray-500"}
                    `}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center"
                            >
                                <Icon
                                    size={22}
                                    className={
                                        active ? "text-blue-600" : "text-gray-500"
                                    }
                                />

                                <span
                                    className={`
                    text-xs mt-1
                    ${active ? "text-blue-600" : "text-gray-500"}
                  `}
                                >
                                    {item.label}
                                </span>

                                <div
                                    className={`
                    mt-1 h-1 w-1 rounded-full
                    ${active ? "bg-blue-600" : "bg-transparent"}
                  `}
                                />
                            </Link>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default Stickyfooter;