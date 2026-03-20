import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { rows } = await client.query("SELECT * FROM categories");
    return sendSuccess(res, rows, "List Categories");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return sendFail(res, "Name and type are required", "VALIDATION_ERROR", null, 400);
    }
    const { rows } = await client.query(
      "INSERT INTO categories (name, type, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [name, type],
    );
    console.log(rows);
    return sendSuccess(res, rows[0], "Category created", 201);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    if (!id) {
      return sendFail(res, "Id is required", "VALIDATION_ERROR", null, 400);
    }
    if (!name || !type) {
      return sendFail(res, "Name and type are required", "VALIDATION_ERROR", null, 400);
    }
    const { rows } = await client.query(
      "UPDATE categories SET name = $1, type = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [name, type, id],
    );
    const updatedCategory = rows[0];
    if (!updatedCategory) {
      return sendFail(res, "Category not found", "NOT_FOUND", null, 404);
    }
    return sendSuccess(res, updatedCategory, "Category updated");
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
    const { rows } = await client.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id],
    );
    const DeleteCategory = rows[0];
    if (!DeleteCategory) {
      return sendFail(res, "Category not found", "NOT_FOUND", null, 404);
    }
    return sendSuccess(res, null, "Category removed");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
