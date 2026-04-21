//สร้าง Instacne ของ Axios นํากลับมาใช้ใหม่ใน components ได้

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// 1. สร้างตัวเชื่อมต่อ API พื้นฐาน
const apiClient: AxiosInstance = axios.create({
  // URL ของ Backend
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 10000,

  // indicates whether or not cross-site Access-Control requests
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    // Accept: "application/json",
  },
});

// ทำงานคล้ายๆกับ middleware
// Request Interceptor
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // ถ้า Backend ส่ง error กลับมา หรือ Token หมดอายุ สามารถเขียนดักเด้งไปหน้าจอ Login ตรงนี้ได้
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, token may be expired");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
