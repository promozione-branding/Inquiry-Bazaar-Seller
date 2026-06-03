"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ClienteleSlider() {
    const clients = [
        "/clientimages/1.webp",
        "/clientimages/2.webp",
        "/clientimages/3.png",
        "/clientimages/4.webp",
        "/clientimages/5.webp",
        "/clientimages/6.webp",
        "/clientimages/7.png",
        "/clientimages/8.webp",
        "/clientimages/9.png",
        "/clientimages/10.webp",
        "/clientimages/11.webp",
        "/clientimages/12.webp",
        "/clientimages/13.webp",
        "/clientimages/14.webp",
        // "/clientimages/15.webp",
        "/clientimages/16.png",
        "/clientimages/17.jpg",
        "/clientimages/18.webp",
        "/clientimages/19.webp",
    ];

    return (
        <section className="pt-10 px-4 md:px-10 w-full bg-gray-100">
            <div className="flex justify-between">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Explore products from Premium Brands
                </h2>
                <div className="hidden sm:flex">
                    <Link href="/" className="hover:underline text-[#f45a06] flex gap-1 items-center">
                        View all
                        <ArrowRight size={22} className="bg-[#f45a06] p-1 rounded-full text-white" />
                    </Link>
                </div>
            </div>

            <Swiper
                modules={[Autoplay, FreeMode]}
                loop={true}
                speed={4000}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 10
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 6,
                        spaceBetween: 20
                    },
                }}
                className="py-10!"
            >
                {clients.map((logo, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex items-center py-2 justify-center h-30 w-full transition shadow-md hover:shadow-xl bg-white rounded-md">
                            <Image
                                src={logo}
                                alt="client"
                                width={300}
                                height={260}
                                className="object-contain h-full w-full"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
