"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="">
                    <Image
                        src="/Logo/logoo.webp"
                        alt="Inquiry Bazaar"
                        width={200}
                        height={200}
                        className="rounded-xl shadow-lg"
                    />
                </div>

                {/* Social Icons */}
                <div className="flex gap-6">
                    <a target="blank" href="https://www.facebook.com/people/Inquiry-Bazaar/61562989183794/" className="hover:text-blue-500 transition">
                        <Facebook size={25} />
                    </a>

                    <a target="blank" href="https://www.instagram.com/inquirybazaar/" className="hover:text-pink-500 transition">
                        <Instagram size={25} />
                    </a>

                    <a target="blank" href="https://www.linkedin.com/company/inquiry-bazaar/?viewAsMember=true" className="hover:text-blue-500 transition">
                        <Linkedin size={25} />
                    </a>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="md:flex justify-around border-t border-gray-800 py-6 text-center text-base text-gray-300">
                <p>© Copyright 2026 Inquiry Bazaar Pvt Ltd.</p>

                <p className="mt-1">
                    Developed & Manage by <span className="text-white">Promozione Branding Pvt Ltd.</span>
                </p>
            </div>
        </footer>
    );
}