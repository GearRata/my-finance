import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as TransactionService from "../services/transactions.service.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { limit } = req.params;
    const user_id = req.user.id;

    const transactions = await TransactionService.getTransaction(
      user_id,
      Number(limit),
    );

    return sendSuccess(res, transactions, `${limit} Recent Transactions`);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const pagination = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const type = (req.query.type as string) || "all";
    const category = (req.query.category as string) || "all";
    const page = parseInt(req.query.page as string) || 1;
    const search = (req.query.search as string) || "";
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await TransactionService.paginationTransactions(
      user_id,
      type,
      category,
      page,
      search,
      limit,
    );

    return res.json({
      status: "success",
      data: data.result,
      pagination: {
        currentPage: data.page,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.limit,
      },
    });
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const summary = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;

    const result = await TransactionService.summaryTransactions(user_id);

    return sendSuccess(res, result, "Total Cash In-Flow/Out-Flow");
  } catch (error) {
    console.log(error);
    return sendError(res, "Internal server error occurred while fetching data");
  }
};

export const analytics = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;

    const result = await TransactionService.analyticeTransactions(user_id);

    return sendSuccess(res, result, "Retrieved dashboard data successfully");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const { amount, note, account_id, category_id, transaction_date } =
      req.body;

    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(Number(amount))
    ) {
      return sendFail(res, "Amount is required", "VALIDATION_ERROR", null, 400);
    }
    if (!account_id) {
      return sendFail(
        res,
        "Account is required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }
    if (!category_id) {
      return sendFail(
        res,
        "Category is required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    const result = await TransactionService.createTransactions(
      user_id,
      amount,
      note,
      account_id,
      category_id,
      transaction_date,
    );
    return sendSuccess(res, result, "Created", 201);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const { amount, note, account_id, category_id, transaction_date } =
      req.body;

    if (
      amount === undefined ||
      amount === null ||
      Number.isNaN(Number(amount))
    ) {
      return sendFail(res, "Amount is required", "VALIDATION_ERROR", null, 400);
    }
    if (!account_id) {
      return sendFail(
        res,
        "Account is required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }
    if (!category_id) {
      return sendFail(
        res,
        "Category is required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    const result = await TransactionService.updateTransactions(
      user_id,
      amount,
      note,
      account_id,
      category_id,
      transaction_date,
      Number(id),
    );

    return sendSuccess(res, result, "Updated");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await TransactionService.deleteTransaction(
      Number(id),
      user_id,
    );

    return sendSuccess(res, result, "A Transaction is delete");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const listby = async (req: Request, res: Response) => {
  try {
    const { sort, order, limit } = req.body;

    const result = await TransactionService.listBy(sort, order, limit);

    return sendSuccess(res, result);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const searchFilter = async (req: Request, res: Response) => {
  try {
    const { name, category, amount } = req.body;

    const result = await TransactionService.searchFilter(
      name,
      category,
      amount,
    );
    return sendSuccess(res, result, "Search Complete");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
