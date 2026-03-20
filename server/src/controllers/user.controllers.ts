import type { Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";

export const userBudget = async (req: Request, res: Response) => {
  try {
    const { month, budget } = req.body;

    const budgetQuery = `
      INSERT INTO
        budgets (month, user_id, created_at)
      VALUES ($1, $2, NOW()) 
      RETURNING *  
    `;
    const { rows } = await client.query(budgetQuery, [month, req.user.id]);
    const newBudget = rows[0];

    if (budget && budget.length > 0) {
      const itemQuery = `
        INSERT INTO
          budget_item (budget_id, category_id, amount, note, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
      await Promise.all(
        budget.map((item: any) =>
          client.query(itemQuery, [
            newBudget.id,
            item.category_id,
            item.amount,
            item.note,
          ]),
        ),
      );
    }

    return sendSuccess(res, newBudget, "Add Budget Success");
  } catch (error) {
    console.log(error);
    return sendError(res, "Cannot add budget");
  }
};

export const getUserBudget = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        b.id AS budget_id,
        b.month,
        b.status,
        bi.id AS item_id,
        c.name AS category_name,
        bi.amount,
        bi.note
      FROM budgets b
      LEFT JOIN budget_item bi ON bi.budget_id = b.id
      LEFT JOIN categories c ON bi.category_id = c.id
      WHERE 
        b.user_id = $1 AND b.status = 'draft'
      ORDER BY b.created_at DESC
    `;
    const { rows } = await client.query(query, [req.user.id]);

    return sendSuccess(res, rows);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const emptyBudget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const query = `
      DELETE FROM
        budgets
      WHERE 
        id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await client.query(query, [id, req.user.id]);

    if (rows.length === 0) {
      return sendFail(res, "Budget not found", "NOT_FOUND", null, 404);
    }

    return sendSuccess(res, rows, "Deleted");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const budgetConfirm = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const query = `
      UPDATE budgets
      SET status = 'confirmed', updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND status = 'draft'
      RETURNING *
    `;
    const { rows } = await client.query(query, [id, req.user.id]);

    if (rows.length === 0) {
      return sendFail(
        res,
        "Budget not found or already confirmed",
        "NOT_FOUND",
        null,
        404,
      );
    }

    return sendSuccess(res, rows[0], "Budget confirmed");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const budgetHistory = async (req: Request, res: Response) => {
  try {
    // ดึงงบที่ confirmed แล้ว
    const query = `
      SELECT
        b.id AS budget_id,
        b.month,
        b.status,
        bi.id AS item_id,
        c.name AS category_name,
        bi.amount,
        bi.note
      FROM budgets b
      LEFT JOIN budget_item bi ON bi.budget_id = b.id
      LEFT JOIN categories c ON bi.category_id = c.id
      WHERE 
        b.user_id = $1 AND b.status = 'confirmed'
      ORDER BY b.created_at DESC
    `;
    const { rows } = await client.query(query, [req.user.id]);
    console.log(req.user.id);

    return sendSuccess(res, rows);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};
