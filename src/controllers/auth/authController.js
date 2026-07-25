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
  const userExists = await User.findOne({
    role: "supplier",
    $or: [
      { email },
      { phone },
    ],
  });

  if (userExists) {
    if (userExists.email === email) {
      throw new Error("Email already exists.");
    }

    if (userExists.phone === phone) {
      throw new Error("Phone number already exists.");
    }
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
  const { email, phone } = data;

  // Check if another supplier already has the same email or phone
  if (email || phone) {
    const existingSupplier = await User.findOne({
      _id: { $ne: userId }, // Exclude current user
      role: "supplier",
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingSupplier) {
      if (email && existingSupplier.email === email) {
        throw new Error("Email already exists.");
      }

      if (phone && existingSupplier.phone === phone) {
        throw new Error("Phone number already exists.");
      }
    }
  }

  return await User.findByIdAndUpdate(
    userId,
    { $set: data },
    { new: true }
  );
};