import mongoose from "mongoose";

const IntegrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    provider: {
        type: String,
        required: true,
        enum: [
            "meta",
            "google",
            "website",
            "whatsapp",
            "manual",
            "indiamart",
            "tradeindia",
            "other",
        ],
        index: true,
    },

    status: {
        type: String,
        enum: [
            "connected",
            "disconnected",
            "error",
            "pending",
        ],
        default: "disconnected",
        index: true,
    },

    credentials: {
        accessToken: {
            type: String,
            default: null,
        },

        refreshToken: {
            type: String,
            default: null,
        },

        apiKey: {
            type: String,
            default: null,
        },

        apiSecret: {
            type: String,
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },

    account: {
        id: {
            type: String,
            default: null,
        },

        name: {
            type: String,
            default: null,
        },
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    connectedAt: {
        type: Date,
        default: null,
    },

    lastSyncAt: {
        type: Date,
        default: null,
    },

    errorMessage: {
        type: String,
        default: null,
    },
}, { timestamps: true, });

IntegrationSchema.index({ userId: 1, provider: 1 }, { unique: true });
export default mongoose.models.Integration || mongoose.model("Integration", IntegrationSchema);