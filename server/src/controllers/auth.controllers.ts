import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError, sendFail } from "../utils/apiResponse.js";
import * as AuthService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validate request
    const errors: { field: string; detail: string }[] = [];

    if (!username) {
      errors.push({ field: "username", detail: "username is required." });
    }
    // ตรวจสอบรูปแบบ email และ password
    if (!email) {
      errors.push({ field: "email", detail: "email is required." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: "email", detail: "email is invalid format." });
    }

    if (!password) {
      errors.push({ field: "password", detail: "password is required." });
    } else if (password.length < 6) {
      errors.push({
        field: "password",
        detail: "password must be at least 6 characters.",
      });
    }

    if (errors.length > 0) {
      return sendFail(
        res,
        "Invalid Request data",
        "VALIDATION_ERROR",
        errors,
        400,
      );
    }

    try {
      await AuthService.register(username, email, password);
      return sendSuccess(res, null, "Register Success", 201);
    } catch (error: unknown) {
      // ใช้ if (error instanceof Error) เพื่อปลดล็อก type 'unknown'
      if (error instanceof Error) {
        if (error.message === "Email already exists") {
          return sendFail(
            res,
            "Email already exists",
            "EMAIL_EXISTS",
            null,
            400,
          );
        }
      }
      throw error; // โยน error อื่นๆ เข้า catch รวบยอดด้านล่าง
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request
    const errors: { field: string; detail: string }[] = [];

    // ตรวจสอบรูปแบบ email และ password
    if (!email) {
      errors.push({ field: "email", detail: "email is required." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: "email", detail: "email is invalid format." });
    }

    if (!password) {
      errors.push({ field: "password", detail: "password is required." });
    }

    if (errors.length > 0) {
      return sendFail(
        res,
        "Invalid Request data",
        "VALIDATION_ERROR",
        errors,
        400,
      );
    }

    try {
      const user = await AuthService.login(email, password);

      // Create Payload
      const payload = {
        id: user.id,
        email: user.email,
      };

      // Create JWT token
      jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        { expiresIn: "5h" },
        (err, token) => {
          if (err || !token) {
            return sendError(res);
          }

          // Response ให้เก็บ cookie ไว้บน Browser
          res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
            sameSite: "lax",
          });
          return sendSuccess(res, payload, "Login Sucess");
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "USER_NOT_FOUND") {
          return sendFail(res, "User not found", "USER_NOT_FOUND", null, 404);
        }
        if (error.message === "USER_DISABLED") {
          return sendFail(res, "User not enabled", "USER_DISABLED", null, 400);
        }
        if (error.message === "INVALID_PASSWORD") {
          return sendFail(
            res,
            "Password is not correct",
            "INVALID_PASSWORD",
            null,
            400,
          );
        }
      }
      throw error;
    }
  } catch (error) {
    return sendError(res);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return sendSuccess(res, null, "Logout Success");
  } catch (error) {
    return sendError(res);
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    // authCheck ดึงข้อมูลมาใส่ req.user ไว้แล้ว
    return sendSuccess(res, req.user, "Current User");
  } catch (error) {
    return sendError(res);
  }
};
