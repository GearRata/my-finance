import apiClient from "@/lib/api/axios";
import type {
  Transaction,
  CreateTransaction,
  UpdateTransaction,
} from "../types/transaction.types";

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
  categoryId,
  page,
  search,
  limit,
}: Transaction) => {
  try {
    const response = await apiClient.get("/transactions", {
      params: {
        type,
        categoryId,
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

export const createTransaction = async (payload: CreateTransaction) => {
  try {
    const response = await apiClient.post("/transactions", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTransaction = async ({
  payload,
  id,
}: {
  payload: UpdateTransaction;
  id: number;
}) => {
  try {
    const response = await apiClient.put(`/transactions/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {}
};
