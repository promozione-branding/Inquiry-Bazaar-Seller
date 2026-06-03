import { S3Client } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUD_FLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUD_FLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUD_FLARE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // ✅ required for R2
});