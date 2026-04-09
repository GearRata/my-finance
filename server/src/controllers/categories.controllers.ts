import type { Request, Response } from "express";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as CategoriesService from "../services/categories.service.js";

export const list = async (req: Request, res: Response) => {
  try {
    const rows = await CategoriesService.listCategories();
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
    const newCategory = await CategoriesService.createCategory(name, type);
    console.log([newCategory]);
    return sendSuccess(res, newCategory, "Category created", 201);
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

    try {
      const updatedCategory = await CategoriesService.updateCategory(id as string, name, type);
      return sendSuccess(res, updatedCategory, "Category updated");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Category not found") {
          return sendFail(res, "Category not found", "NOT_FOUND", null, 404);
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
      await CategoriesService.removeCategory(id as string);
      return sendSuccess(res, null, "Category removed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Category not found") {
          return sendFail(res, "Category not found", "NOT_FOUND", null, 404);
        }
      }
      throw error;
    }
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
