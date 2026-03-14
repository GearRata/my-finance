import apiClient from "@/lib/api/axios";
import { Login, Register } from "@/features/auth/types/auth.types";

// Login
export const loginAPI = async (data: Login) => {

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
