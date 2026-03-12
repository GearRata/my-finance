import apiClient from "@/lib/api/axios";
import { Login, Register } from "@/types/api/auth.types";

// Login
export const loginAPI = async (data: Login) => {
  // การเรียกนี้จะแปลงเป็น http://localhost:5000/api/login อัตโนมัติ เพราะเราเซ็ต baseURL ไว้
  const response = await apiClient.post("/login", data);
  return response.data;
};

// CurrentUser
export const checkCurrentUserAPI = async () => {
  const response = await apiClient.post("/current-user");
  return response.data;
};

// Register
export const registerAPI = async (data: Register) => {
  const response = await apiClient.post("/register", data);
  return response.data;
};

// Logout
export const logoutAPI = async () => {
  const response = await apiClient.post("/logout");
  return response.data;
};
