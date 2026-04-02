import apiClient from "@/lib/api/axios";

export const fetchTotal = async () => {
  try {
    const resposne = await apiClient.get("/goals/total");
    return resposne.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchGoals = async () => {
  try {
    const response = await apiClient.get("/goals/all");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createGoal = async (data: any) => {
  try {
    const response = await apiClient.post("/goals", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
