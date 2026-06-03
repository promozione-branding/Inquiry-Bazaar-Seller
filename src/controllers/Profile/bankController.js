import Bank from "@/models/UserBank";

/* CREATE / UPDATE */
export const upsertBank = async (userId, data) => {
  return await Bank.findOneAndUpdate(
    { userId },
    { ...data, userId },
    { new: true, upsert: true }
  );
};

/* GET */
export const getBank = async (userId) => {
  return await Bank.findOne({ userId });
};