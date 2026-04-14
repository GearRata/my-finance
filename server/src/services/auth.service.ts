import * as AuthModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";

export const register = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingUser = await AuthModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Hash password (นำรหัสมาเข้ารหัสแบบทางเดียวและ salt เพิ่มเข้าไป)
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await AuthModel.createUser(username, email, hashPassword);

  return newUser;
};

export const login = async (email: string, password: string) => {
  // Check if user exists
  const user = await AuthModel.findUserByEmail(email);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!user.enabled) {
    throw new Error("USER_DISABLED");
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_PASSWORD");
  }

  return user;
};
