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
