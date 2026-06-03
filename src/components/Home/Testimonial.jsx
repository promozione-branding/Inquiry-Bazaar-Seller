"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
    {
        name: "matrix tissues",
        photo: "/clientimages/16.png",
        message:
            "InquiryBazaar ne sirf listing nahi di, balki hume real business inquiries milna start hua. Leads ka quality genuinely better hai aur conversion bhi improve hua.",
    },
    {
        name: "exotic crate",
        photo: "/clientimages/10.webp",
        message:
            "Pehle hum multiple platforms use kar rahe the but results clear nahi the. Yahan hume proper visibility aur genuine buyers mile — exactly what we needed.",
    },
    {
        name: "shree shakti infratech",
        photo: "/clientimages/7.png",
        message:
            "InquiryBazaar ka biggest advantage hai targeted inquiries. Random calls band ho gaye aur sirf serious buyers hi connect karte hain.",
    },
    {
        name: "strides design studio",
        photo: "/clientimages/9.png",
        message:
            "Unki marketing approach alag hai — sirf listing nahi, actively promote karte hain. Isse humari brand visibility kaafi strong hui hai.",
    },
    {
        name: "bhagya laxmi industries",
        photo: "/clientimages/14.webp",
        message:
            "Platform use karna simple hai aur results transparent hain. Hume clearly dikhta hai inquiries kahan se aa rahi hain. Highly Recommended",
    },
    {
        name: "mr dates",
        photo: "/clientimages/13.webp",
        message:
            "InquiryBazaar ne humara time aur effort dono bachaya. Ab hume sirf relevant aur high-intent buyers se hi inquiries milti hain.",
    },
];

export default function TestimonialSection() {
    return (
        <section className="bg-white py-6 text-center max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-semibold  text-gray-900">
                What Our Clients Say
            </h2>

            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                spaceBetween={30}
                slidesPerView={3}
                className="py-10!"
                breakpoints={{
                    320: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {testimonials.map(({ name, photo, message }, index) => (
                    <SwiperSlide key={index} className="!h-auto flex">
                        <div className="flex flex-col w-full bg-white rounded-2xl shadow-lg p-4 h-full border border-gray-200">
                            <div className="mb-4 flex items-center justify-center h-12">
                                <img
                                    src={photo}
                                    alt={name}
                                    className="max-h-full object-contain"
                                />
                            </div>

                            <p className="text-black italic text-sm leading-relaxed flex-grow">
                                “{message}”
                            </p>

                            <p className="font-semibold capitalize text-gray-900">
                                {name}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}