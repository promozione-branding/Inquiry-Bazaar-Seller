import Business from "@/models/UserBusiness";

/* CREATE or UPDATE (UPSERT) */
export const upsertBusiness = async (userId, data) => {
  const business = await Business.findOneAndUpdate(
    { userId },
    { ...data, userId },
    { new: true, upsert: true }
  );

  return business;
};

/* GET */
export const getBusiness = async (userId) => {
  return await Business.findOne({ userId });
};

/* UPDATE SOCIAL */
export const updateSocial = async (userId, socialData) => {
  return await Business.findOneAndUpdate(
    { userId },
    { $set: { social: socialData } },
    { new: true }
  );
};

/* GET SOCIAL */
export const getSocial = async (userId) => {
  const data = await Business.findOne({ userId }).select("social");
  return data?.social || {};
};