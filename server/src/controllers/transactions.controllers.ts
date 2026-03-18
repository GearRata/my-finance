import type { Request, Response } from "express";
import { client } from "../config/db.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { count } = req.params;

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
            ORDER BY t.created_at DESC
            LIMIT $1
        `;

    const { rows } = await client.query(query, [count]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
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
      return res.status(400).json({ message: "Amount is required" });
    }
    if (!account_id) {
      return res.status(400).json({ message: "Account is required" });
    }
    if (!category_id) {
      return res.status(400).json({ message: "Category is required" });
    }

    const accountResult = await client.query(
      `
        SELECT 
          id, balance
        FROM accounts
        WHERE id = $1 AND user_id = $2
      `,
      [account_id, user_id],
    );

    const account = accountResult.rows[0] as { id: number; balance: number };
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const categoryResult = await client.query(
      `
        SELECT 
          id, type
        FROM categories
        WHERE id = $1
      `,
      [category_id],
    );

    const category = categoryResult.rows[0] as { id: number; type: string };
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.type !== "income" && category.type !== "expense") {
      return res.status(400).json({ message: "Invalid category type" });
    }

    const amountNumber = Number(amount);
    if (amountNumber <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const insertResult = await client.query(
      `
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
      `,
      [
        amountNumber,
        note,
        user_id,
        account_id,
        category_id,
        transaction_date ?? null,
      ],
    );

    const delta = category.type === "income" ? amountNumber : -amountNumber;
    const updatedAccountResult = await client.query(
      `
        UPDATE accounts
        SET balance = balance + $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING id, name, balance, user_id, created_at, updated_at
      `,
      [delta, account_id, user_id],
    );
    res.status(201).json({
      message: "Created",
      transaction: insertResult.rows[0],
      account: updatedAccountResult.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, note, user_id, account_id, category_id, transaction_date } =
      req.body;

    const query = `
            UPDATE
                transactions
            SET
                amount = $1,
                note = $2,
                user_id = $3,
                account_id = $4,
                category_id = $5,
                transaction_date = $6,
                updated_at = NOW()
            WHERE
                id = $7
            RETURNING *
        `;

    const { rows } = await client.query(query, [
      amount,
      note,
      user_id,
      account_id,
      category_id,
      transaction_date,
      id,
    ]);
    res.json({ message: "ok", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
        DELETE FROM
           transactions
         WHERE
            id = $1
        `;

    const { rows } = await client.query(query, [id]);

    res.json({ message: "A Transaction is delete" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listby = async (req: Request, res: Response) => {
  try {
    const { sort, order, limit } = req.body;
    const query = `
            SELECT 
                *
            FROM transactions
            ORDER BY ${sort} ${order.toUpperCase()}
            LIMIT $1
        `;
    const { rows } = await client.query(query, [limit]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleName = async (req: Request, res: Response, name: string) => {
  try {
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
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search Error" });
  }
};

const handleAmount = async (req: Request, res: Response, amount: number[]) => {
  try {
    // amount เป็น array [min, max] เช่น [1000, 5000]
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
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search Error" });
  }
};

const handleCategory = async (
  req: Request,
  res: Response,
  category: number[],
) => {
  try {
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
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search Error" });
  }
};

export const searchFilter = async (req: Request, res: Response) => {
  try {
    const { name, category, amount } = req.body;
    console.log(req.body);

    if (name) {
      console.log("Query --->", name);
      await handleName(req, res, name);
    }
    if (category) {
      console.log("category --->", category);
      await handleCategory(req, res, category);
    }
    if (amount) {
      console.log("amount --->", amount);
      await handleAmount(req, res, amount);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const total = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;

    // COALESCE คือ ไม่เอาค่า NULL ถ้า argument แรกเป็น NULL ก็จะไปเอาค่าถัดไป
    const query = `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'income' THEN t.amount ELSE 0
            END
          ), 0
        ) AS total_income,
        COALESCE(
          SUM(
            CASE
              WHEN c.type = 'expense' THEN t.amount ELSE 0 
            END
          ), 0 
        ) AS total_expense
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = $1
    `;

    const { rows } = await client.query(query, [user_id]);
    const data = rows[0];

    const totalIncome = Number(data.total_income);
    const totalExpense = Number(data.total_expense);
    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const analytics = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;

    const trendQuery = `
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
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE user_id = $1 AND transaction_date >= date_trunc('month', CURRENT_DATE - INTERVAL '1 year')
      GROUP BY month
      ORDER BY month asc
    `;
    const trendResult = await client.query(trendQuery, [user_id]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const trendData = trendResult.rows.map((row) => {
      const [year, month] = row.month.split("-");
      return {
        year: year,
        month: months[parseInt(month) - 1],
        income: Number(row.income),
        expense: Number(row.expense),
      };
    });

    const pieQuery = `
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

    const pieResult = await client.query(pieQuery, [user_id]);

    const pieData = pieResult.rows.map((row) => {
      return {
        name: row.name || "ไม่ระบุ",
        value: Number(row.value),
      };
    });

    res.status(200).json({
      status: "success",
      message: "Retrieved dashboard data successfully",
      data: {
        trend: trendData,
        pie: pieData,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
