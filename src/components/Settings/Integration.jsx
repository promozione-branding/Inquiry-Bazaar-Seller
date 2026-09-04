import React from 'react';
import { ArrowLeft, Globe, Facebook, Webhook, CheckCircle2, XCircle, Link2 } from 'lucide-react';
import Link from 'next/link';

export default function Integration({ setLayout, user }) {
    const isMetaConnected = false;
    const isWebhookConnected = false;

    return (
        <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex flex-col items-center justify-center text-center mb-8 relative">
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

                <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-4 rounded-2xl mb-2">
                        <Globe size={28} className="text-blue-600" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        Integration
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 max-w-lg">
                        Connect Inquiry Bazaar with other applications to enhance
                        your experience.
                    </p>
                </div>
            </div>

            {/* Integration Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="group border border-gray-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
                            {/* Facebook / Meta Icon */}
                            <Facebook size={30} className="text-blue-600" />
                        </div>

                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isMetaConnected
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {isMetaConnected ? (
                                <>
                                    <CheckCircle2 size={13} />
                                    Connected
                                </>
                            ) : (
                                <>
                                    <XCircle size={13} />
                                    Not Connected
                                </>
                            )}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Meta / Facebook
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        Connect your Meta account to receive and manage Facebook
                        inquiries directly.
                    </p>

                    <Link href={"/integration/meta"}
                        className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isMetaConnected
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            }`}
                    >
                        <Link2 size={16} />
                        {isMetaConnected ? 'Reconnect' : 'Connect Meta'}
                    </Link>
                </div>

                <div className="group border border-gray-200 rounded-2xl p-5 hover:border-purple-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center">
                            <Webhook size={30} className="text-purple-600" />
                        </div>

                        <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isWebhookConnected
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                                }`}
                        >
                            {isWebhookConnected ? (
                                <>
                                    <CheckCircle2 size={13} />
                                    Connected
                                </>
                            ) : (
                                <>
                                    <XCircle size={13} />
                                    Not Connected
                                </>
                            )}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        Webhook
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        Send inquiry data to your own application using a secure
                        webhook endpoint.
                    </p>

                    <Link href={"/integration/webhook"}
                        className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${isWebhookConnected
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                            }`}
                    >
                        <Link2 size={16} />
                        {isWebhookConnected ? 'Disconnect' : 'Configure Webhook'}
                    </Link>
                </div>
            </div>
        </div>
    );
}