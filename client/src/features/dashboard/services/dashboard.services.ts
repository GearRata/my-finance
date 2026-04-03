import apiClient from "@/lib/api/axios";

export const getTransactions = async (limit: number) => {
  const response = await apiClient.get(`/transactions/${limit}`);
  return response.data;
};

export const getGoals = async (limit: number) => {
  const response = await apiClient.get(`/goals/${limit}`);
  return response.data;
};

export const getCashFlowSummary = async () => {
  const response = await apiClient.get("/transactions/summary");
  return response.data;
};

export const getDashboardAnalytics = async () => {
  const response = await apiClient.get("/transactions/analytics");
  return response.data;
};
