import { client } from "../config/db.js";

export const insertBudget = async (month: string, user_id: number | string) => {
  const budgetQuery = `
      INSERT INTO
        budgets (month, user_id, created_at)
      VALUES ($1, $2, NOW()) 
      RETURNING *  
    `;
  const { rows } = await client.query(budgetQuery, [month, user_id]);
  return rows[0];
};

export const insertBudgetItem = async (
  budget_id: number | string,
  category_id: number | string,
  amount: number,
  note: string,
) => {
  const itemQuery = `
        INSERT INTO
          budget_item (budget_id, category_id, amount, note, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;
  const { rows } = await client.query(itemQuery, [
    budget_id,
    category_id,
    amount,
    note,
  ]);
  return rows[0];
};

export const getDraftBudgets = async (user_id: number | string) => {
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
  const { rows } = await client.query(query, [user_id]);
  return rows;
};

export const deleteBudget = async (
  id: number | string,
  user_id: number | string,
) => {
  const query = `
      DELETE FROM
        budgets
      WHERE 
        id = $1 AND user_id = $2
      RETURNING *
    `;
  const { rows } = await client.query(query, [id, user_id]);
  return rows;
};

export const confirmBudgetStatus = async (
  id: number | string,
  user_id: number | string,
) => {
  const query = `
      UPDATE budgets
      SET status = 'confirmed', updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND status = 'draft'
      RETURNING *
    `;
  const { rows } = await client.query(query, [id, user_id]);
  return rows;
};

export const getConfirmedBudgets = async (user_id: number | string) => {
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
  const { rows } = await client.query(query, [user_id]);
  return rows;
};
