import type { Request, Response } from "express";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as AdminService from "../services/admin.service.js";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const rows = await AdminService.listUsers();
    return sendSuccess(res, rows, "List Users");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id, enabled } = req.body;
    const errors: { field: string; detail: string }[] = [];
    if (!id) {
      errors.push({ field: "id", detail: "id is required." });
    }

    if (typeof enabled !== "boolean") {
      errors.push({
        field: "enabled",
        detail: "enabled is required and must be boolean.",
      });
    }

    if (errors.length > 0) {
      return sendFail(res, "Invalid request", "VALIDATION_ERROR", errors, 400);
    }

    await AdminService.changeStatus(id, enabled);
    return sendSuccess(res, null, "Update Status Success");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.body;
    const errors: { field: string; detail: string }[] = [];

    if (!id) {
      errors.push({ field: "id", detail: "id is required." });
    }

    if (!role) {
      errors.push({ field: "role", detail: "role is required." });
    }

    if (errors.length > 0) {
      return sendFail(res, "Invalid request", "VALIDATION_ERROR", errors, 400);
    }

    await AdminService.changeRole(id, role);
    return sendSuccess(res, null, "Update Role Success");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

