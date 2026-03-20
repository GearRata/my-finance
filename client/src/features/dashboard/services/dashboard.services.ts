import apiClient from "@/lib/api/axios";

export const fetchTransactions = async (count: number) => {
  try {
    const response = await apiClient.get(`/transactions/${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const sortTransactions = async ({ sort, order, limit }: any) => {
  try {
    const response = await apiClient.post(`/transactionBy`, {
      sort,
      order,
      limit,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
export const fetchGoals = async (count: number) => {
  try {
    const response = await apiClient.get(`/goals/${count}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
};

export const fetchDashboardSummary = async () => {
  try {
    const response = await apiClient.get("/transactions/total");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const fetchDashboardAnalytics = async () => {
  try {
    const response = await apiClient.get("/transactions/analytics");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    throw error;
  }
};
