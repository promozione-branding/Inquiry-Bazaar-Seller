"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const locations = [
    { name: "Delhi", image: "/locations/india-gate.webp" },
    { name: "Noida", image: "/locations/akshardham-temple.webp" },
    { name: "Gurugram", image: "/locations/black-white-drawing-city-skyline-with-building-background_994744-22209.webp" },
    { name: "Chennai", image: "/locations/monument.webp" },
    { name: "Bangalore", image: "/locations/bangalore.webp" },
    { name: "Mumbai", image: "/locations/gate-of-india.webp" },
    { name: "Ahmedabad", image: "/locations/Ahmedabad-512.webp" },
    { name: "Kolkata", image: "/locations/golden-gate-bridge.webp" },
    { name: "Pune", image: "/locations/pune.webp" },
    { name: "Surat", image: "/locations/Background-1.webp" },
    { name: "Jaipur", image: "/locations/jaipur.webp" },
    { name: "Hyderabad", image: "/locations/charminar.webp" },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const card = {
    hidden: { opacity: 0, y: 40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

export default function Locations() {
    return (
        <div className="px-2 py-10 md:px-12 w-full bg-white">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
                className="text-2xl md:text-4xl font-bold text-gray-900 mb-5 text-center"
            >
                Find Suppliers from Top Cities
            </motion.h2>

            {/* Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false }}
                className="bg-gray-100 p-2 lg:p-6 rounded-2xl grid grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-6"
            >
                {locations.map((loc, index) => (
                    <motion.div
                        key={index}
                        variants={card}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white rounded-md lg:rounded-xl shadow-md p-2 lg:p-5 flex flex-col items-center justify-center group cursor-pointer transition-all"
                    >
                        <div className="h-10 w-10 lg:w-14 lg:h-14 relative mb-3">
                            <Image
                                src={loc.image}
                                alt={loc.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="lg:text-gray-800 text-orange-500 lg:text-base text-sm font-medium group-hover:text-orange-500">{loc.name}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}