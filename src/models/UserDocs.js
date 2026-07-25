import mongoose from "mongoose";

const userDocSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        docUrl: {
            type: String,
            required: true,
        },

        docField: {
            // Cloudflare Key
            type: String,
            required: true,
        },

        fileName: {
            type: String,
            required: true,
        },

        fileType: {
            type: String,
            required: true,
        },

        fileSize: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.UserDoc ||
    mongoose.model("UserDoc", userDocSchema);