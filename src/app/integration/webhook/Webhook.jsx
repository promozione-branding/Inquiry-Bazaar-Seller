"use client";

import React, { useEffect, useState } from "react";
import {
  Copy,
  RefreshCw,
  Webhook as WebhookIcon,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Webhook() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKeyPrefix, setApiKeyPrefix] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [status, setStatus] = useState("inactive");
  const [lastUsedAt, setLastUsedAt] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const loadWebhook = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/webhook");

      if (res.data.success) {
        const webhook = res.data.webhook;

        setWebhookUrl(webhook.url || "");
        setApiKeyPrefix(webhook.apiKeyPrefix || "");
        setStatus(webhook.status || "inactive");
        setLastUsedAt(webhook.lastUsedAt || null);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to load webhook settings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhook();
  }, []);

  const handleGenerateApiKey = async () => {
    try {
      setGenerating(true);

      const res = await axios.post("/api/webhook/generate");

      if (res.data.success) {
        setNewApiKey(res.data.apiKey);
        setWebhookUrl(res.data.webhookUrl);
        setApiKeyPrefix(res.data.apiKey.substring(0, 15));
        setStatus("active");

        toast.success("API key generated successfully");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to generate API key"
      );
    } finally {
      setGenerating(false);
    }
  };

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(message);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const displayApiKey =
    newApiKey ||
    (apiKeyPrefix
      ? `${apiKeyPrefix}••••••••••••`
      : "");

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Webhook
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Connect your website, WordPress, landing pages,
            or other platforms to receive leads automatically.
          </p>
        </div>

        {/* API Configuration */}
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center gap-3 border-b border-gray-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <WebhookIcon size={19} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                API Configuration
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Use these credentials to send leads to your CRM.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">

            {/* Webhook URL */}
            <div>
              <label className="text-xs font-medium text-gray-700">
                Webhook URL
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  readOnly
                  value={loading ? "Loading..." : webhookUrl}
                  className="h-10 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none"
                />

                <button
                  type="button"
                  disabled={!webhookUrl}
                  onClick={() =>
                    copyText(
                      webhookUrl,
                      "Webhook URL copied"
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy size={15} />
                </button>
              </div>
            </div>

            {/* API Key */}
            <div>
              <label className="text-xs font-medium text-gray-700">
                API Key
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  readOnly
                  type={showApiKey ? "text" : "password"}
                  value={
                    displayApiKey ||
                    "No API key generated"
                  }
                  className="h-10 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs text-gray-700 outline-none"
                />

                {newApiKey && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowApiKey(!showApiKey)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    {showApiKey ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  disabled={!newApiKey}
                  onClick={() =>
                    copyText(
                      newApiKey,
                      "API key copied"
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Copy size={15} />
                </button>
              </div>

              {newApiKey && (
                <p className="mt-2 text-[11px] text-amber-600">
                  Copy this API key now. The complete key
                  will not be shown again.
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={18}
                  className={
                    status === "active"
                      ? "text-green-500"
                      : "text-gray-400"
                  }
                />

                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {status === "active"
                      ? "API Active"
                      : "API Not Configured"}
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {lastUsedAt
                      ? `Last used: ${new Date(
                        lastUsedAt
                      ).toLocaleString()}`
                      : "Your webhook has not received any requests yet."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateApiKey}
                disabled={generating}
                className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={
                    generating ? "animate-spin" : ""
                  }
                />

                {generating
                  ? "Generating..."
                  : apiKeyPrefix
                    ? "Regenerate"
                    : "Generate API Key"}
              </button>
            </div>
          </div>
        </div>

        {/* Request Format */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Request Format
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Send a POST request with your API key in the
            Authorization header.
          </p>

          <div className="mt-5 space-y-4">

            <div>
              <p className="mb-1 text-[11px] font-medium text-gray-500">
                Method
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
                POST
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-medium text-gray-500">
                Authorization
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-medium text-gray-500">
                Content-Type
              </p>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700">
                application/json
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}