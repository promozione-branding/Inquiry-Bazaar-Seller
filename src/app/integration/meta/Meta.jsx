"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Facebook,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Meta() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [integration, setIntegration] = useState(null);
  const [pages, setPages] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [selectingAssets, setSelectingAssets] = useState(false);

  const handleBack = () => {
    router.push("/settings");
  };

  // Connect Meta
  const handleConnect = () => {
    window.location.href = "/api/meta/connect";
  };

  // Check Meta status
  const checkStatus = async () => {
    try {
      setLoading(true);

      const { data } =
        await axios.get(
          "/api/meta/status",
          {
            withCredentials: true,
          }
        );

      if (data.success) {
        setConnected(
          data.connected
        );

        setIntegration(
          data.integration
        );
      }

    } catch (error) {
      console.error(
        "Meta status error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch Facebook Pages + Ad Accounts
  const fetchAssets = async () => {
    try {
      setLoadingAssets(true);

      const { data } = await axios.get(
        "/api/meta/assets",
        {
          withCredentials: true,
        }
      );

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to fetch Meta assets"
        );
      }

      setPages(
        data.pages || []
      );

    } catch (error) {
      console.error(
        "Fetch Meta assets error:",
        error
      );
    } finally {
      setLoadingAssets(false);
    }
  };

  // Select Facebook Page
  const handleSelectPage = async (pageId) => {
    try {
      setSelectingAssets(true);

      const { data } =
        await axios.post(
          "/api/meta/assets/select",
          {
            pageId,
          },
          {
            withCredentials: true,
          }
        );

      if (!data.success) {
        throw new Error(
          data.message ||
          "Failed to connect Meta Page"
        );
      }

      await checkStatus();

    } catch (error) {
      console.error(
        "Select Meta Page error:",
        error
      );
    } finally {
      setSelectingAssets(false);
    }
  };

  // Initial status
  useEffect(() => {
    checkStatus();
  }, []);

  // Fetch assets when connected
  useEffect(() => {
    if (
      connected &&
      !integration?.metadata?.pageId
    ) {
      fetchAssets();
    }
  }, [connected, integration]);

  // Loading
  if (loading) {
    return (
      <div className="bg-white p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={30}
              className="text-blue-600 animate-spin"
            />

            <p className="text-sm text-gray-500">
              Checking Meta connection...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 h-fit mt-4 border border-gray-100 max-w-2xl mx-auto">
      {/* Header */}
      <div className="relative flex flex-col items-center text-center mb-8">
        <button
          onClick={handleBack}
          className="
                        absolute left-0 top-0
                        flex items-center gap-2
                        bg-white
                        border border-gray-200
                        text-gray-700
                        px-4 py-2
                        rounded-md
                        shadow-sm
                        hover:bg-gray-50
                        hover:shadow-md
                        transition-all duration-200
                    "
        >
          <ArrowLeft size={18} />
          <span className="font-medium">
            Back
          </span>
        </button>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
            <Facebook
              size={25}
              className="text-blue-600"
            />
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Meta / Facebook
          </h2>

          <p className="text-sm text-gray-500 mt-1 max-w-lg">
            Connect your Facebook account and select
            the Page you want to use with Inquiry Bazaar.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="border border-gray-200 rounded-2xl p-5">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Facebook
                size={25}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800">
                Facebook
              </h3>

              <div className="flex items-center gap-1.5 mt-1">

                <span
                  className={`w-1.5 h-1.5 rounded-full ${connected
                    ? "bg-emerald-500"
                    : "bg-gray-400"
                    }`}
                />

                <span className="text-xs text-gray-500">
                  {connected
                    ? "Connected"
                    : "Not Connected"}
                </span>

              </div>
            </div>

          </div>

          {connected && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
              <CheckCircle2 size={13} />
              Active
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-5 mt-4">
          Connect Facebook to receive leads from your
          business pages and manage them inside Inquiry Bazaar.
        </p>

        {/* NOT CONNECTED */}
        {!connected && (
          <div className="mt-5">
            <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 mb-4">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <AlertCircle
                    size={17}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Connect your Facebook account
                  </p>

                  <p className="text-xs text-gray-500 mt-1 leading-5">
                    You will be redirected to Meta to
                    authorize access to your Facebook
                    Pages.
                  </p>
                </div>

              </div>
            </div>

            <button onClick={handleConnect}
              className="
                                w-full
                                h-10
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                text-sm
                                font-medium
                                transition-colors
                                flex
                                items-center
                                justify-center
                                gap-2
                                cursor-pointer
                            "
            >
              <Facebook size={17} />
              Connect Facebook
            </button>
          </div>
        )}

        {/* CONNECTED */}
        {connected && (
          <div className="mt-5 space-y-4">
            {integration?.metadata?.pageId ? (
              <>
                <div className="border border-gray-200 rounded-xl p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div className="min-w-0">

                      <p className="text-xs text-gray-500">
                        Connected Facebook Page
                      </p>

                      <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                        {
                          integration
                            ?.metadata
                            ?.pageName ||
                          "Facebook Page"
                        }
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1">
                        Page ID:{" "}
                        {
                          integration
                            ?.metadata
                            ?.pageId
                        }
                      </p>

                    </div>

                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-medium">
                      Active
                    </span>

                  </div>

                </div>

                {/* Ad Account */}

                {integration?.metadata?.adAccountId && (
                  <div className="border border-gray-200 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Connected Ad Account
                    </p>

                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {
                        integration
                          ?.metadata
                          ?.adAccountName ||
                        integration
                          ?.metadata
                          ?.adAccountId
                      }
                    </p>

                  </div>
                )}

                {/* Lead Webhook */}

                {integration?.metadata?.leadgenSubscribed && (
                  <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-4">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs text-gray-500">
                          Facebook Lead Webhook
                        </p>

                        <p className="text-sm font-medium text-emerald-600 mt-1">
                          Lead capture enabled
                        </p>
                      </div>

                      <CheckCircle2
                        size={18}
                        className="text-emerald-500"
                      />

                    </div>

                  </div>
                )}

                {/* Reconnect */}

                <button
                  onClick={handleConnect}
                  className="
                                        w-full
                                        h-10
                                        rounded-xl
                                        bg-gray-800
                                        hover:bg-gray-900
                                        text-white
                                        text-sm
                                        font-medium
                                        transition-colors
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        cursor-pointer
                                    "
                >
                  <RefreshCw size={16} />
                  Reconnect Facebook
                </button>
              </>
            ) : (
              <div>
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Select Facebook Page
                  </h4>

                  <p className="text-xs text-gray-500 mt-1">
                    Choose the page from which you want
                    to receive leads.
                  </p>
                </div>

                {loadingAssets ? (
                  <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center">
                    <Loader2
                      size={22}
                      className="text-blue-600 animate-spin"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      Loading Facebook Pages...
                    </p>
                  </div>
                ) : pages.length > 0 ? (

                  <div className="space-y-2">

                    {pages.map((page) => (

                      <button
                        key={page.id}
                        disabled={selectingAssets}
                        onClick={() =>
                          handleSelectPage(
                            page.id
                          )
                        }
                        className="
                                                    w-full
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-3
                                                    border
                                                    border-gray-200
                                                    rounded-xl
                                                    p-3
                                                    text-left
                                                    hover:border-blue-400
                                                    hover:bg-blue-50/30
                                                    transition-all
                                                    disabled:opacity-50
                                                    cursor-pointer
                                                "
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Facebook
                              size={18}
                              className="text-blue-600"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-medium text-gray-800 truncate">
                              {page.name}
                            </p>

                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {page.id}
                            </p>

                          </div>

                        </div>

                        <div className="shrink-0">

                          {selectingAssets ? (
                            <Loader2
                              size={16}
                              className="text-blue-600 animate-spin"
                            />
                          ) : (
                            <span className="text-xs font-medium text-blue-600">
                              Select
                            </span>
                          )}

                        </div>

                      </button>

                    ))}

                  </div>

                ) : (

                  <div className="border border-red-100 bg-red-50 rounded-xl p-4">

                    <div className="flex gap-3">

                      <AlertCircle
                        size={17}
                        className="text-red-500 shrink-0"
                      />

                      <div>
                        <p className="text-sm font-medium text-red-600">
                          No Facebook Pages found
                        </p>

                        <p className="text-xs text-red-500/80 mt-1">
                          Make sure your Meta account
                          has access to at least one
                          Facebook Page.
                        </p>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}