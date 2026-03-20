import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { rows } = await client.query("SELECT * FROM accounts");
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
    if (!name || !balance) {
      return sendFail(
        res,
        "name and balance are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    // Create new Account
    await client.query(
      "INSERT INTO accounts (name, balance, user_id, created_at) VALUES ($1, $2, $3, NOW())",
      [name, balance, user_id],
    );

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
    if (!name || !balance) {
      return sendFail(
        res,
        "Name and balance are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    // Update account data
    const { rows } = await client.query(
      "UPDATE accounts SET name = $1, balance = $2, user_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [name, balance, user_id, id],
    );
    const updateAccount = rows[0];
    if (!updateAccount) {
      return sendFail(res, "Account not found", "NOT_FOUND", null, 404);
    }
    return sendSuccess(res, updateAccount, "Account updated");
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

    // Delete account
    const { rows } = await client.query(
      "DELETE FROM accounts WHERE id = $1 RETURNING *",
      [id],
    );
    const account = rows[0];

    if (!account) {
      return sendFail(res, "Account not found", "NOT_FOUND", null, 404);
    }
    return sendSuccess(res, null, "Delete Account");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
