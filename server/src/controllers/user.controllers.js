import { client } from "../config/db.js";

export const userBudget = async (req, res) => {
  try {
    const { month, budget } = req.body;
    // budget = [{ category_id: 37, amount: 5000, note: "ค่าอาหาร" }, ...]

    // 1. สร้างงบ (budgets)
    const budgetQuery = `
      INSERT INTO
        budgets (month, user_id, created_at)
      VALUES ($1, $2, NOW()) 
      RETURNING *  
    `;
    const { rows } = await client.query(budgetQuery, [month, req.user.id]);
    const newBudget = rows[0];

    // 2. เพิ่มรายการ (budget_items) — ถ้ามี
    if (budget && budget.length > 0) {
      const itemQuery = `
        INSERT INTO
          budget_item (budget_id, category_id, amount, note, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *
      `;

      // INSERT ทีละรายการด้วย Promise.all (เหมือน cart ใน workshop)
      await Promise.all(
        budget.map((item) =>
          client.query(itemQuery, [
            newBudget.id,
            item.category_id,
            item.amount,
            item.note,
          ]),
        ),
      );
    }

    res.json({ message: "Add Budget Success", data: newBudget });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Cannot add budget" });
  }
};

export const getUserBudget = async (req, res) => {
  try {
    // ดึงงบ draft ของ user คนนี้ พร้อมรายการข้างใน
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

    res.json({ message: "ok", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const emptyBudget = async (req, res) => {
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
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Deleted", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const budgetConfirm = async (req, res) => {
  try {
    const { id } = req.body;

    // เปลี่ยน status จาก draft → confirmed (ล็อคงบ)
    const query = `
      UPDATE budgets
      SET status = 'confirmed', updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND status = 'draft'
      RETURNING *
    `;
    const { rows } = await client.query(query, [id, req.user.id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Budget not found or already confirmed" });
    }

    res.json({ message: "Budget confirmed", data: rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const budgetHistory = async (req, res) => {
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

    res.json({ message: "ok", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
