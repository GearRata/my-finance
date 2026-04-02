import apiClient from "@/lib/api/axios";
import type { fetchTransaction } from "../types/transaction.types";

export const fetchCount = async () => {
  try {
    const response = await apiClient.get("/transactions/count");
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Total number of transactions this month",
      error,
    );
    throw error;
  }
};

export const fetchSummaryCashFlow = async () => {
  try {
    const response = await apiClient.get("/transactions/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const fetchTransactions = async ({
  type,
  category,
  page,
  search,
  limit,
}: fetchTransaction) => {
  try {
    const response = await apiClient.get("/transactions", {
      params: {
        type,
        category,
        page,
        search,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const fetchCatogories = async () => {
  try {
    const response = await apiClient.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const CreateTransaction = async (payload: any) => {
  try {
    const response = await apiClient.post("/transactions", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateTransaction = async ({ payload, id }: any) => {
  try {
    const response = await apiClient.put(`/transactions/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteTransaction = async (id: number) => {
  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {}
};
