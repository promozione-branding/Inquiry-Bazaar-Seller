import mongoose from "mongoose";

const additionalInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    panNumber: {
      type: String,
      uppercase: true,
    },

    aadhaarNumber: {
      type: String,
    },

    tanNumber: {
      type: String,
      uppercase: true,
    },

    webhookApiKeyHash: {
      type: String,
      default: null,
    },

    webhookApiKeyPrefix: {
      type: String,
      default: null,
    },

    webhookApiStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    webhookLastUsedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdditionalInfo || mongoose.model("AdditionalInfo", additionalInfoSchema);