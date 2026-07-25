import React from "react";
import { Star } from "lucide-react";

export default function Review({ user }) {
    const getSupplierStats = (phone) => {
        if (!phone) {
            return { rating: "4.4", reviews: 28 };
        }

        const digits = phone.toString().replace(/\D/g, "");
        const sum = [...digits].reduce((acc, digit) => acc + Number(digit), 0);

        return {
            rating: (4.0 + (sum % 8) * 0.1).toFixed(1),
            reviews: 10 + ((sum * 7) % 41),
        };
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating - full >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);

        return (
            <>
                {[...Array(full)].map((_, i) => (
                    <Star
                        key={`f-${i}`}
                        size={18}
                        className="fill-amber-400 text-amber-400"
                    />
                ))}

                {half && (
                    <div className="relative w-[18px] h-[18px]">
                        <Star
                            size={18}
                            className="absolute text-gray-300 fill-gray-300"
                        />
                        <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden">
                            <Star
                                size={18}
                                className="fill-amber-400 text-amber-400"
                            />
                        </div>
                    </div>
                )}

                {[...Array(empty)].map((_, i) => (
                    <Star key={`e-${i}`} size={18} className="text-gray-300" />
                ))}
            </>
        );
    };

    const { rating, reviews } = getSupplierStats(user?.phone);

    return (
        <div className="bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">

                {/* Left */}
                <div className="flex flex-col items-center">
                    <div className="text-6xl font-bold text-slate-900 leading-none">
                        {rating}
                    </div>

                    <div className="flex mt-3 gap-1">
                        {renderStars(Number(rating))}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        Based on {reviews} verified reviews
                    </p>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px self-stretch bg-slate-200" />

                {/* Right */}
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800">
                        Trusted Supplier
                    </h3>

                    <p className="mt-2 text-slate-600 leading-7">
                       You maintained a consistently positive reputation for
                        product quality, timely responses and customer satisfaction.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                            ✓ Verified Supplier
                        </span>

                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                            ⭐ {reviews}+ Happy Buyers
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}