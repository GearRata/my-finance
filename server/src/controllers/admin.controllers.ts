import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        id, email, created_at, role, enabled
      FROM
        users
    `;
    const { rows } = await client.query(query);

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

    const query = `
      UPDATE
        users
      SET
        enabled = $1
      WHERE 
        id = $2
    `;
    await client.query(query, [enabled, id]);
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
    const query = `
      UPDATE
        users
      SET
        role = $1
      WHERE
        id = $2
    `;

    await client.query(query, [role, id]);

    return sendSuccess(res, null, "Update Role Success");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
