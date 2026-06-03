import User from "@/models/User";
import bcrypt from "bcryptjs";

export const registerUser = async (data) => {
  const {
    name,
    email,
    phone,
    password,
    role,
  } = data;

  // CHECK USER
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // CREATE USER
  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  return user;
};

export const updateUser = async (userId, data) => {
  return await User.findByIdAndUpdate(userId,
    { $set: data, }, { new: true, }
  );
};