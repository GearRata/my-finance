// src/utils/apiResponse.ts
import type { Response } from "express";

interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message: string;
  data: T | null;
  error?: {
    code: string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => {
  const body: ApiResponse<T> = { status: "success", message, data };
  return res.status(statusCode).json(body);
};

export const sendFail = (
  res: Response,
  message: string,
  code: string,
  details?: unknown,
  statusCode = 400,
) => {
  const body: ApiResponse<null> = {
    status: "fail",
    message,
    data: null,
    error: { code, details },
  };
  return res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  message = "Internal server error",
  statusCode = 500,
) => {
  const body: ApiResponse<null> = {
    status: "error",
    message,
    data: null,
    error: { code: "INTERNAL_SERVER_ERROR" },
  };
  return res.status(statusCode).json(body);
};
