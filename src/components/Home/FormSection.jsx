import React from 'react'

export default function FormSection() {
    return (
        <div className="bg-gray-100 flex items-center justify-center px-6">
            <div className="max-w-7xl w-full grid md:grid-cols-2 gap-10 items-center">
                <div className="flex justify-center justify-self-center h-96 w-fit p-2 rounded-lg overflow-hidden shadow-md bg-white">
                    <img
                        src="/mob3.jpg"
                        alt="Seller Banner"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-4xl font-bold leading-tight mb-6">
                        Sell for free
                        <span className="font-normal">
                            {" "}on India's largest online B2B marketplace
                        </span>
                    </h1>

                    <h2 className="text-lg font-semibold mb-2">
                        Free Registration/Sign In
                    </h2>

                    <form className="flex flex-col sm:flex-row overflow-hidden rounded-lg shadow-md bg-white">
                        <div className="flex items-center px-4 border-r border-gray-300">
                            <span className="text-lg">+91</span>
                        </div>

                        {/* Mobile Input */}
                        <input
                            type="tel"
                            placeholder="Enter 10 digit mobile number"
                            className="flex-1 px-5 py-4 outline-none text-lg"
                        />

                        {/* Button */}
                        <button type="submit"
                            className="bg-[#0e2347] hover:opacity-90 text-white font-semibold px-8 py-4 transition"
                        >
                            Start Selling →
                        </button>
                    </form>

                    <div className="grid grid-cols-3 gap-6 mt-5">

                        <div>
                            <h3 className="text-3xl font-bold text-[#0e2347]">
                                10K+
                            </h3>
                            <p className="text-gray-600">
                                Verified Suppliers
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-[#0e2347]">
                                50K+
                            </h3>
                            <p className="text-gray-600">
                                Monthly Buyers
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-[#0e2347]">
                                24/7
                            </h3>
                            <p className="text-gray-600">
                                Support
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}