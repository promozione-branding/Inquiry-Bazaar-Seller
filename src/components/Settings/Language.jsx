"use client";

import React, { useState } from "react";

import {
    ArrowLeft,
    Globe,
    Check,
    Languages,
} from "lucide-react";

export default function Language({ setLayout }) {

    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languages = [
        {
            name: "English",
            native: "English",
            code: "EN",
        },
        {
            name: "Hindi",
            native: "हिन्दी",
            code: "HI",
        },
        {
            name: "Gujarati",
            native: "ગુજરાતી",
            code: "GU",
        },
        {
            name: "Marathi",
            native: "मराठी",
            code: "MR",
        },
    ];

    const saveLanguage = () => {
        console.log(selectedLanguage);

        // API CALL HERE
    };

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 max-w-2xl mx-auto">

            {/* HEADER */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative">

                {/* BACK BUTTON */}
                <button
                    onClick={() => setLayout(null)}
                    className="absolute left-0 top-0 flex items-center gap-2 
                    bg-white/80 backdrop-blur-md border border-gray-200 
                    text-gray-700 px-4 py-2 rounded-md shadow-sm 
                    hover:bg-white hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200"
                >
                    <ArrowLeft size={18} />
                    <span className="font-medium">Back</span>
                </button>

                <div className="bg-cyan-100 p-4 rounded-2xl mb-3">
                    <Globe size={30} className="text-cyan-600" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                    Language Settings
                </h2>

                <p className="text-sm text-gray-500 mt-2 max-w-md">
                    Choose your preferred application language for a personalized experience.
                </p>
            </div>

            {/* LANGUAGE LIST */}
            <div className="space-y-4">

                {languages.map((language) => {

                    const active =
                        selectedLanguage === language.name;

                    return (
                        <button
                            key={language.code}
                            onClick={() =>
                                setSelectedLanguage(language.name)
                            }
                            className={`w-full border rounded-2xl p-5 flex items-center justify-between transition-all duration-200
                            ${active
                                    ? "border-cyan-500 bg-cyan-50"
                                    : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                                }`}
                        >

                            <div className="flex items-center gap-4">

                                <div
                                    className={`p-3 rounded-2xl
                                    ${active
                                            ? "bg-cyan-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    <Languages size={22} />
                                </div>

                                <div className="text-left">

                                    <h3 className="font-semibold text-gray-800">
                                        {language.name}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {language.native}
                                    </p>
                                </div>
                            </div>

                            {/* ACTIVE CHECK */}
                            {active && (
                                <div className="bg-cyan-500 text-white p-2 rounded-full">
                                    <Check size={16} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* SAVE BUTTON */}
            <button
                onClick={saveLanguage}
                className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-md font-medium transition-all duration-200"
            >
                Save Language
            </button>
        </div>
    );
}