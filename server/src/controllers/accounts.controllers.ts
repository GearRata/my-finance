import type { Request, Response } from "express";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as AccountService from "../services/accounts.service.js";

export const list = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const rows = await AccountService.listAccounts(user_id);
    return sendSuccess(res, rows, "List Accounts");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const { name, balance } = req.body;

    // Validate request
    if (!name || balance === undefined) {
      return sendFail(
        res,
        "name and balance are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    // Create new Account
    await AccountService.createAccount(name, balance, user_id);

    return sendSuccess(res, null, "Created account", 201);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, balance, user_id } = req.body;

    if (!id) {
      return sendFail(res, "Id is required", "VALIDATION_ERROR", null, 400);
    }
    if (!name || balance === undefined) {
      return sendFail(
        res,
        "Name and balance are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    try {
      // Update account data
      const updateAccount = await AccountService.updateAccount(id, name, balance, user_id);
      return sendSuccess(res, updateAccount, "Account updated");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Account not found") {
          return sendFail(res, "Account not found", "NOT_FOUND", null, 404);
        }
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendFail(res, "Id is required", "VALIDATION_ERROR", null, 400);
    }

    try {
      // Delete account
      await AccountService.removeAccount(id);
      return sendSuccess(res, null, "Delete Account");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Account not found") {
          return sendFail(res, "Account not found", "NOT_FOUND", null, 404);
        }
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
