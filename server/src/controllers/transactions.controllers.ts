import fs from "fs";
import type { Request, Response } from "express";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import * as TransactionService from "../services/transactions.service.js";
import { redisClient } from "../config/db.js";
import FormData from "form-data";
import axios from "axios";

export const list = async (req: Request, res: Response) => {
  try {
    const { limit } = req.params;
    const user_id = req.user.id;
    const cacheKey = `list:${user_id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("CACHE HIT: Returning list from Redis");
      return sendSuccess(
        res,
        JSON.parse(cachedData),
        "Recent Transactions (Cached)",
      );
    }
    console.log("CACHE MISS: Fetching list from DB and saving to Redis");
    const result = await TransactionService.getTransaction(
      user_id,
      Number(limit),
    );
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result || null));

    return sendSuccess(res, result, `${limit} Recent Transactions`);
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
    const cacheKey = `summary:${user_id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("CACHE HIT: Returning summary from Redis");
      return sendSuccess(
        res,
        JSON.parse(cachedData),
        "Total Cash In-Flow/Out-Flow (Cached)",
      );
    }
    console.log("CACHE MISS: Fetching summary from DB and saving to Redis");
    const result = await TransactionService.summaryTransactions(user_id);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result || null));

    return sendSuccess(res, result, "Total Cash In-Flow/Out-Flow");
  } catch (error) {
    console.log(error);
    return sendError(res, "Internal server error occurred while fetching data");
  }
};

export const analytics = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const cacheKey = `analytics:${user_id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("CACHE HIT: Returning analytics from Redis");
      return sendSuccess(
        res,
        JSON.parse(cachedData),
        "Retrieved dashboard data successfully",
      );
    }
    console.log("CACHE MISS: Fetching analytics from DB and saving to Redis");
    const result = await TransactionService.analyticeTransactions(user_id);
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result || null));

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

    await Promise.all([
      redisClient.del(`summary:${user_id}`),
      redisClient.del(`analytics:${user_id}`),
      redisClient.del(`list:${user_id}`),
    ]);

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
    await Promise.all([
      redisClient.del(`summary:${user_id}`),
      redisClient.del(`analytics:${user_id}`),
      redisClient.del(`list:${user_id}`),
    ]);

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
    await Promise.all([
      redisClient.del(`summary:${user_id}`),
      redisClient.del(`analytics:${user_id}`),
      redisClient.del(`list:${user_id}`),
    ]);

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

export const scanslip = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const form = new FormData();
    form.append("files", fs.createReadStream(file.path));

    const slipResponse = await axios.post(`${process.env.SLIPOK_API}`, form, {
      headers: {
        "x-authorization": `${process.env.SLIPOK_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    fs.unlinkSync(file.path);

    const slipData = slipResponse.data;
    res.status(200).json({ message: "Success", data: slipData });
  } catch (error: any) {
    console.error("Error from SlipOK:", error?.response?.data || error);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาด", error: error?.response?.data });
  }
};
