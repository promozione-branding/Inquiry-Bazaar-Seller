import React from "react";

export default function FormSection() {
    return (
        <div className="h-[80vh] md:h-[70vh] bg-cover bg-center bg-no-repeat flex md:items-center items-start"
            style={{ backgroundImage: "url('/banner.webp')", }}>

            <div className="max-w-7xl mx-auto w-full px-4">
                <div className="grid md:grid-cols-2 gap-10 items-center">

                    {/* Left side empty for image visibility */}
                    <div></div>

                    {/* Right Side Form */}
                    <div className="bg-white/95 p-4 md:p-8 rounded-xl shadow-xl">
                        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
                            Sell for free
                            <span className="font-normal">
                                {" "}on India's largest online B2B marketplace
                            </span>
                        </h1>

                        <h2 className="text-lg font-semibold mb-2">
                            Free Registration/Sign In
                        </h2>

                        <form className="flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-md bg-white border">
                            <div className="flex items-center w-full py-4">
                                <div className="flex items-center px-2 md:px-4 border-r border-gray-300">
                                    <span className="text-lg">+91</span>
                                </div>

                                <input
                                    type="tel"
                                    placeholder="Enter 10 digit mobile number"
                                    className="flex-1 px-2 md:px-5 outline-none text-lg"
                                />
                            </div>

                            <button type="submit"
                                className="bg-[#0e2347] text-nowrap hover:opacity-90 text-white font-semibold px-8 py-4 transition"
                            >
                                Start Selling →
                            </button>
                        </form>

                        <div className="grid grid-cols-3 gap-6 mt-6">
                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">10K+</h3>
                                <p className="text-gray-600">Verified Suppliers</p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">50K+</h3>
                                <p className="text-gray-600">Monthly Buyers</p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold text-[#0e2347]">24/7</h3>
                                <p className="text-gray-600">Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}