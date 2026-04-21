import apiClient from "@/lib/api/axios";
import { Login, Register } from "@/features/auth/types/auth.types";

// Login
export const login = async (data: Login) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

// CurrentUser
export const checkCurrentUser = async () => {
  const response = await apiClient.get("/current-user");
  return response.data;
};

// Register
export const register = async (data: Register) => {
  const response = await apiClient.post("/register", data);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await apiClient.post("/logout");
  return response.data;
};
