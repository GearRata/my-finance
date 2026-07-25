// สร้าง Instance ของ Axios นํากลับมาใช้ใหม่ใน components ได้

import axios, { AxiosInstance } from "axios";

// 1. สร้างตัวเชื่อมต่อ API พื้นฐาน
const apiClient: AxiosInstance = axios.create({
  // URL ของ Backend
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 10000,

  // ส่ง httpOnly cookie ไปกับทุก request อัตโนมัติ
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // ถ้า Token หมดอายุ หรือ Unauthorized → redirect ไปหน้า Login
    // ยกเว้น auth endpoints เพื่อป้องกัน redirect loop
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config?.url || "";
      const isAuthEndpoint =
        requestUrl.includes("/login") ||
        requestUrl.includes("/register") ||
        requestUrl.includes("/current-user");

      if (!isAuthEndpoint && typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
