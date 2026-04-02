import type { Request, Response } from "express";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as UserService from "../services/user.service.js";

export const userBudget = async (req: Request, res: Response) => {
  try {
    const { month, budget } = req.body;
    const newBudget = await UserService.addBudget(month, req.user.id, budget);
    return sendSuccess(res, newBudget, "Add Budget Success");
  } catch (error) {
    console.log(error);
    return sendError(res, "Cannot add budget");
  }
};

export const getUserBudget = async (req: Request, res: Response) => {
  try {
    const rows = await UserService.getUserDraftBudgets(req.user.id);
    return sendSuccess(res, rows);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const emptyBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const rows = await UserService.emptyUserBudget(id as string, req.user.id);
      return sendSuccess(res, rows, "Deleted");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Budget not found") {
          return sendFail(res, "Budget not found", "NOT_FOUND", null, 404);
        }
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const budgetConfirm = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    try {
      const confirmedBudget = await UserService.confirmUserBudget(
        id,
        req.user.id,
      );
      return sendSuccess(res, confirmedBudget, "Budget confirmed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Budget not found or already confirmed") {
          return sendFail(
            res,
            "Budget not found or already confirmed",
            "NOT_FOUND",
            null,
            404,
          );
        }
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const budgetHistory = async (req: Request, res: Response) => {
  try {
    // ดึงงบที่ confirmed แล้ว
    const rows = await UserService.getUserBudgetHistory(req.user.id);
    console.log(req.user.id);

    return sendSuccess(res, rows);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
