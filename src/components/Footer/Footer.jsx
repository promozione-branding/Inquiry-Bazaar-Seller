"use client";
import Link from "next/link";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
} from "react-icons/fa";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    //  const handleSubscribe = async () => {
    //     if (!email) return;

    //     try {
    //       setLoading(true);
    //       setMessage("");

    //       const res = await fetch("/api/subscribe", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ email }),
    //       });

    //       const data = await res.json();

    //       if (res.ok) {
    //         setMessage("Subscribed successfully 🎉");
    //         setEmail("");
    //       } else {
    //         setMessage(data.message || "Something went wrong");
    //       }
    //     } catch (error) {
    //       setMessage("Failed to subscribe");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    return (
        <footer className="w-full pb-20 md:pb-0 text-[13px] leading-[1.4] text-black">
            <div className="bg-[#1e3a5f] text-white px-4 sm:px-6 md:px-10 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_99_helpline.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[50px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Dedicated Support</p>
                            <p>Call: +91 7303486777</p>
                            <p>(Mon–Sun: 9am–8pm)</p>
                            <p>Get quick assistance for all your business needs.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_102_original-tag.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[50px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Verified Suppliers Only</p>
                            <p>Connect with trusted manufacturers & wholesalers. Every supplier is screened for quality and reliability.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_100_box.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[50px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Quick Response</p>
                            <p>Get multiple quotations within hours of posting your requirement. Save time and close deals faster.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_103_wallet-check.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[47px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Wide Product Categories</p>
                            <p>Explore lakhs of products across multiple industries. One platform for all your B2B sourcing needs.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_103_wallet-check.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[47px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Buyer Assistance</p>
                            <p>Our team helps you find the right supplier at the best price. Hassle-free sourcing experience guaranteed.</p>
                        </div>
                    </div>

                    <div className="flex gap-3 items-start">
                        <Image src="/footer/bottom/imgi_104_secure-shield.webp" alt="Hybrid B2B Marketplace in India" width={100} height={100} className="h-[50px] w-auto object-contain" />
                        <div>
                            <p className="font-semibold text-[15px]">Buyer Protection</p>
                            <p>Committed to buyer interests to provide a smooth shopping experience.</p>
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-[15px] mb-2">
                            Follow us on
                        </p>

                        <div className="flex gap-4 text-[16px]">
                            <a href="https://www.facebook.com/profile.php?id=61562989183794"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                            w-9 h-9
                            rounded-full
                            border
                            border-gray-300
                            flex
                            items-center
                            justify-center
                            hover:bg-[#1877F2]
                            hover:text-white
                            hover:border-[#1877F2]
                            transition-all
                            duration-300
                            "
                            >
                                <FaFacebookF />
                            </a>

                            {/* INSTAGRAM */}
                            <a href="https://www.instagram.com/inquirybazaar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
        w-9 h-9
        rounded-full
        border
        border-gray-300
        flex
        items-center
        justify-center
        hover:bg-gradient-to-r
        hover:from-pink-500
        hover:to-orange-400
        hover:text-white
        transition-all
        duration-300
      "
                            >
                                <FaInstagram />
                            </a>

                            {/* LINKEDIN */}
                            <a href="https://www.linkedin.com/company/inquiry-bazaar/?viewAsMember=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
        w-9 h-9
        rounded-full
        border
        border-gray-300
        flex
        items-center
        justify-center
        hover:bg-[#0A66C2]
        hover:text-white
        hover:border-[#0A66C2]
        transition-all
        duration-300
      "
                            >
                                <FaLinkedinIn />
                            </a>

                            {/* YOUTUBE */}
                            <a href="https://www.youtube.com/@inquirybazaar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
        w-9 h-9
        rounded-full
        border
        border-gray-300
        flex
        items-center
        justify-center
        hover:bg-[#FF0000]
        hover:text-white
        hover:border-[#FF0000]
        transition-all
        duration-300
      "
                            >
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* GREEN SECTION */}
            <div className="bg-[#c9d8b6] px-4 sm:px-6 md:px-12 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div>
                        <p className="font-bold text-[15px] mb-3">COMPANY</p>
                        <ul className="space-y-1">
                            <div>
                                <Link href="https://corporate.inquirybazaar.com/about/whoweare">About Us</Link>
                            </div>

                            <div>
                                <Link href="https://inquirybazaar.com/contact-us">Contact Us</Link>
                            </div>

                            <div>
                                <Link href="https://corporate.inquirybazaar.com/career">Careers</Link>
                            </div>


                            <div>
                                <Link href="https://seller.inquirybazaar.com/register">Become a Supplier</Link>
                            </div>

                            <div>
                                <Link href="https://corporate.inquirybazaar.com/blogs">Blog</Link>
                            </div>

                        </ul>
                    </div>

                    <div>
                        <p className="font-bold text-[15px] mb-3">SISTER SITE</p>
                        <ul className="space-y-1">
                            <li>
                                <a href="https://www.promozionebranding.com/">Promozione Branding</a>
                            </li>
                            <li>
                                <a href="https://www.promotionbranding.com/">Promotion Branding</a>
                            </li>

                            

                            <li>
                                <a href="https://promozionebranding.com/">Top 10 Digital Marketing Agency</a>
                            </li>

                        </ul>
                    </div>

                    <div>
                        <p className="font-bold text-[15px] mb-3">HELP</p>
                        <ul className="space-y-1">
                            <li><Link href="https://inquirybazaar.com/faqs">FAQs</Link></li>
                            <li><Link href="https://inquirybazaar.com/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="https://inquirybazaar.com/shipping-policy">Shipping Policy</Link></li>
                            <li><Link href="https://inquirybazaar.com/return-refund">Return & Refund Policy</Link></li>
                            <li><Link href="https://inquirybazaar.com/terms-conditions">Terms & Conditions</Link></li>
                            <li><a href="mailto:care@inquirybazaar.com">Write to Management</a></li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div className="bg-white rounded-[10px] p-4 shadow-sm w-full text-black">
                        <p className="text-[16px] font-semibold mb-3 text-center">
                            Subscribe to Newsletter
                        </p>

                        <div className="flex flex-col sm:flex-row bg-[#f3f3f3] rounded-full overflow-hidden">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-3 py-2 text-[13px] bg-transparent outline-none"
                            />

                            <button

                                disabled={loading}
                                className="bg-black text-white text-[12px] px-4 py-2 disabled:opacity-50"
                            >
                                {loading ? "SUBSCRIBING..." : "SUBMIT NOW"}
                            </button>
                        </div>

                        {message && (
                            <p className="text-center mt-2 text-sm">
                                {message}
                            </p>
                        )}

                        <p className="text-[12px] text-gray-600 mt-2 text-center">
                            Sign up to get exclusive offers and updates
                        </p>
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="bg-[#f2f2f2] px-4 sm:px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[13px]">
                <p>Copyright@ Inquiry Bazaar Pvt Ltd. 2026 All Right Reserved</p>

                <Image
                    src="/payment-options.webp"
                    alt="Hybrid B2B Marketplace in India"
                    width={450}
                    height={400}
                    className="w-full max-w-[250px] md:max-w-[350px] object-contain"
                />
            </div>

        </footer >
    );
}