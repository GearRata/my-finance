export interface Transaction {
  id: number;
  amount: number;
  note: string | null;
  user_id: number;
  account_id: number;
  category_id: number | null;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface CreateTransactionDTO {
  amount: number;
  note?: string;
  user_id: number;
  account_id: number;
  category_id: number;
  transaction_date?: Date;
}

import { client } from "../config/db.js";

export const getRecentTransactions = async (userId: number, limit: number) => {
  const query = `
         SELECT 
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance,
                    'user_id', a.user_id,
                    'created_at', a.created_at,
                    'updated_at', a.updated_at
                ) AS accounts,
                json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type,
                    'created_at', c.created_at,
                    'updated_at', c.updated_at         
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = $1 AND deleted_at IS NULL
            ORDER BY t.created_at DESC
            LIMIT $2
    `;

  const { rows } = await client.query(query, [userId, limit]);
  return rows as Transaction[];
};

export const filterTransactions = async (
  whereClause: string,
  params: (number | string)[],
) => {
  const query = `
    SELECT 
      COUNT(*) as total
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE ${whereClause}
    AND transaction_date >= date_trunc('month', current_date) 
    AND transaction_date <  date_trunc('month', current_date) + interval '1 month'

  `;
  const { rows } = await client.query(query, params);
  return rows;
};

export const paginationTransaction = async (
  whereClause: string,
  params: (number | string)[],
) => {
  const query = `
      SELECT
        t.*,
        jsonb_build_object(
          'id', a.id,
          'name', a.name,
          'balance', a.balance
        ) AS accounts,
        jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'type', c.type
        ) AS categories
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${whereClause} 
      AND transaction_date >= date_trunc('month', current_date) 
      AND transaction_date <  date_trunc('month', current_date) + interval '1 month'
      ORDER BY t.transaction_date DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `;

  const { rows } = await client.query(query, params);
  return rows;
};

export const findAccountById = async (account_id: number, user_id: number) => {
  const query = `
        SELECT 
          id, balance
        FROM accounts
        WHERE id = $1 AND user_id = $2
      `;

  const { rows } = await client.query(query, [account_id, user_id]);
  return rows;
};

export const findCategoryById = async (category_id: number) => {
  const query = `
     SELECT 
          id, type
        FROM categories
        WHERE id = $1
  `;
  const { rows } = await client.query(query, [category_id]);
  return rows;
};

export const insertTransaction = async (
  amountNumber: number,
  note: string,
  user_id: number,
  account_id: number,
  category_id: number,
  transaction_date: string,
) => {
  const query = `
    INSERT INTO transactions (
      amount,
      note,
      user_id,
      account_id,
      category_id,
      transaction_date,
      created_at
    )
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, NOW()), NOW())
      RETURNING *
  `;
  const { rows } = await client.query(query, [
    amountNumber,
    note,
    user_id,
    account_id,
    category_id,
    transaction_date,
  ]);
  return rows[0];
};

export const updateAccountBalance = async (
  cal: number,
  account_id: number,
  user_id: number,
) => {
  const query = `
        UPDATE accounts
        SET balance = balance + $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING id, name, balance, user_id, created_at, updated_at
      `;
  const { rows } = await client.query(query, [cal, account_id, user_id]);
  return rows[0];
};

export const updateTransaction = async (
  amountNumber: number,
  note: string,
  user_id: number,
  account_id: number,
  category_id: number,
  transaction_date: string,
  id: number,
) => {
  const query = `
    UPDATE
        transactions
    SET
        amount = $1,
        note = $2,
        user_id = $3,
        account_id = $4,
        category_id = $5,
        transaction_date = COALESCE($6, transaction_date),
        updated_at = NOW()
    WHERE
        id = $7
    RETURNING *
  `;
  const { rows } = await client.query(query, [
    amountNumber,
    note,
    user_id,
    account_id,
    category_id,
    transaction_date,
    id,
  ]);
  return rows[0];
};

export const deleteTransaction = async (id: number, user_id: number) => {
  const query = `
     UPDATE
      transactions
      SET deleted_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING id
  `;
  const { rows } = await client.query(query, [id, user_id]);
  return rows[0];
};

export const listBy = async (sort: string, order: string, limit: number) => {
  const query = `
            SELECT 
                *
            FROM transactions
            ORDER BY ${sort} ${order.toUpperCase()}
            LIMIT $1
        `;
  const { rows } = await client.query(query, [limit]);
  return rows;
};

export const handleName = async (name: string) => {
  const query = `
           SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.note ILIKE $1
            ORDER BY t.created_at DESC
        `;
  const { rows } = await client.query(query, [`%${name}%`]);
  return rows;
};

export const handleCategory = async (category: number[]) => {
  const query = `
            SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE
                t.category_id = ANY($1::int[])
            ORDER BY
                t.created_at DESC
        `;
  const { rows } = await client.query(query, [category]);
  return rows;
};

export const handleAmount = async (amount: number[]) => {
  const query = `
            SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE
                t.amount BETWEEN $1 AND $2
            ORDER BY
                t.amount DESC
        `;
  const { rows } = await client.query(query, [amount[0], amount[1]]);
  return rows;
};

export const summaryTransactions = async (user_id: number) => {
  const query = `
      SELECT
        a.id as account_id,
        a.name as account_name,
        a.balance,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'income' THEN t.amount ELSE 0
            END
          ), 0
        ) as total_income,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'expense' THEN t.amount ELSE 0
            END
          ), 0 
        ) as total_expense,
        COUNT(*) as number_of_transaction
      FROM accounts a
      LEFT JOIN transactions t ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE a.user_id = $1 AND transaction_date >= date_trunc('month', current_date)
      AND transaction_date < date_trunc('month', current_date) + interval '1 month'
      AND deleted_at IS NULL
      GROUP BY a.id, a.name, a.balance
      ORDER BY a.id 
    `;
  const { rows } = await client.query(query, [user_id]);
  return rows;
};

export const trendData = async (user_id: number) => {
  const query = `
      SELECT
        to_char(t.transaction_date, 'YYYY-MM') as month,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'income' THEN t.amount ELSE 0
            END
          ), 0
        ) as income,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'expense' THEN t.amount ELSE 0
              END
          ), 0
        ) as expense
      FROM accounts a
      LEFT JOIN transactions t ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE a.user_id = $1 AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 year')
      GROUP BY to_char(t.transaction_date, 'YYYY-MM')
      ORDER BY month ASC
    `;
  const { rows } = await client.query(query, [user_id]);
  return rows;
};

export const pieData = async (user_id: number) => {
  const query = `
      SELECT 
        c.name as name,
        SUM(t.amount) as value
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE user_id = $1 
        AND c.type = 'expense'
        AND t.transaction_date >= date_trunc('month', CURRENT_DATE)
      GROUP BY c.name
      ORDER BY value DESC
    `;
  const { rows } = await client.query(query, [user_id]);
  return rows;
};
