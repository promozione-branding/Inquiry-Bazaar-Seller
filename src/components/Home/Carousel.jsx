"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carousel() {
  const desktopImages = [
    "/banner.jpg",
    "/banner1.jpg",
    "/banner2.jpg",
  ];

  const mobileImages = [
    "/mob1.jpg",
    "/mob2.jpg",
    "/mob3.jpg",
  ];

  return (
    <Swiper
      modules={[Autoplay, Navigation, Pagination, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      speed={1000}
      className="xl:h-118 lg:h-[70vh]"
    >
      {desktopImages.map((desktopImg, index) => (
        <SwiperSlide key={index}>
          <picture>
            {/* Mobile + Tablet */}
            <source
              media="(max-width: 1024px)"
              srcSet={mobileImages[index]}
            />

            {/* Desktop */}
            <img
              src={desktopImg}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </picture>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}