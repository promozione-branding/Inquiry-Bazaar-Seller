"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css"
import Link from "next/link";

const brands = [
    { initials: "VA", name: "Vands Engineering", category: "Engineering Solutions", color: "text-blue-600 bg-blue-50" },
    { initials: "Ai", name: "Ai Solutions", category: "IT & Technology", color: "text-purple-600 bg-purple-50" },
    { initials: "BS", name: "BSM Enterprises", category: "Manufacturing", color: "text-green-600 bg-green-50" },
    { initials: "SR", name: "Shree Shakti Infra", category: "Building & Construction", color: "text-orange-600 bg-orange-50" },

    { initials: "EC", name: "Eco Corp", category: "Sustainability", color: "text-emerald-600 bg-emerald-50" },


    { initials: "MT", name: "Matrix Tissue", category: "Paper & Packaging", color: "text-pink-600 bg-pink-50" },

];

export default function ClienteleSlider() {
    return (
        <>
            <section className="bg-white py-6 px-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-2">
                    <div>

                        <h2 className="text-[24px]  font-bold text-[#0D2340]">
                            Trending Brands
                        </h2>
                    </div>

                </div>

                <div className="max-w-[1400px] mx-auto bg-[#f5f2ef] rounded-[28px] border border-gray-200 overflow-hidden">
                    <div className="px-4  py-4 overflow-hidden">
                        <Swiper
                            modules={[Autoplay]}
                            loop={true}
                            speed={5000}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                            }}
                            allowTouchMove={false}
                            spaceBetween={0}
                            slidesPerView="auto"
                        >
                            {[...brands, ...brands].map((brand, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="!w-auto flex items-center group"
                                >
                                    <div className="flex items-center gap-4 px-6 relative transition-all duration-300">

                                        {/* DIVIDER */}
                                        {index !== 0 && (
                                            <div className="absolute left-0 top-0 h-full w-px bg-gray-200"></div>
                                        )}

                                        {/* LOGO */}
                                        <div
                                            className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center 
  font-semibold transition-all duration-300
  ${brand.color}
  grayscale opacity-70 
  group-hover:grayscale-0 group-hover:opacity-100`}
                                        >
                                            {brand.initials}
                                        </div>

                                        {/* TEXT */}
                                        <div className="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                            <p className="text-[18px] font-semibold text-gray-800 whitespace-nowrap">
                                                {brand.name}
                                            </p>
                                            <p className="text-[13px] text-gray-500 whitespace-nowrap">
                                                {brand.category}
                                            </p>
                                        </div>

                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="border-t border-gray-200 px-4 md:px-10 py-1 md:py-2 flex flex-col md:flex-row items-center justify-between gap-2 text-[14px]">

                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            100+ verified brands active on IB
                        </div>

                        <div className="text-gray-600">
                            Want to be featured?{" "}
                            <Link href="/register" className="text-[#ec771c] font-medium cursor-pointer">
                                List your brand free →
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}