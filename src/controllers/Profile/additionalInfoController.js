import AdditionalInfo from "@/models/AdditionalInfo";

/* UPSERT */
export const upsertAdditionalInfo = async (userId, data) => {
  return await AdditionalInfo.findOneAndUpdate(
    { userId },
    { ...data, userId },
    { new: true, upsert: true }
  );
};

/* GET */
export const getAdditionalInfo = async (userId) => {
  return await AdditionalInfo.findOne({ userId });
};