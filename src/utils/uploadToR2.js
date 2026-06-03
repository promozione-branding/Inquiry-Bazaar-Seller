import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/config/r2";

export const uploadToR2 = async ({ file, folder, fileName, contentType }) => {
  const key = `${folder}/${fileName}`;
  // console.log("BUCKET:", process.env.CLOUD_FLARE_R2_BUCKET);
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUD_FLARE_R2_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await r2.send(command);

  return {
    key,
    url: `${process.env.CLOUD_FLARE_R2_PUBLIC_URL}/${key}`,
  };
};