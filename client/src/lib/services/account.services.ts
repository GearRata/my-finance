import apiClient from "../api/axios";
import { Account } from "@/types/account.types";

export const createAccount = async (payload: Account) => {
  const response = await apiClient.post("/accounts", payload);
  return response.data;
};
