import type { Request, Response } from "express";
import { client } from "../config/db.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { count } = req.params;

    const query = `
            SELECT
                goals.*,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type,
                    'created_at', c.created_at,
                    'updated_at', c.updated_at
                ) AS categories,
                (
                    -- COALESCE ถ้ามีข้อมูลจะใช้ค่านั้น แต่ถ้าหากข้อมูลนั้นเป็น NULL จะไปใช้ข้อมูลถัดไป
                    -- jsonb_agg รวบรวมค่าทั้งหมดรวมถึง null ลงใน JSON array
                    SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
                    FROM images i 
                    WHERE i.goal_id = goals.id
                ) AS images
            FROM goals
            LEFT JOIN categories c ON goals.category_id = c.id
            ORDER BY goals.created_at DESC
            LIMIT $1
        `;
    const { rows } = await client.query(query, [count]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const read = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const query = `
            SELECT
                goals.*,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type,
                    'created_at', c.created_at,
                    'updated_at', c.updated_at
                ) AS categories,
                (
                    -- COALESCE ถ้ามีข้อมูลจะใช้ค่านั้น แต่ถ้าหากข้อมูลนั้นเป็น NULL จะไปใช้ข้อมูลถัดไป
                    -- jsonb_agg รวบรวมค่าทั้งหมดรวมถึง null ลงใน JSON array
                    SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
                    FROM images i 
                    WHERE i.goal_id = goals.id
                ) AS images
            FROM goals
            LEFT JOIN categories c ON goals.category_id = c.id
            WHERE
                goals.id = $1
        `;
    const { rows } = await client.query(query, [id]);
    res.send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const { name, target_amount, current_amount, category_id, images } =
      req.body;

    if (!name || !target_amount || !user_id) {
      return res
        .status(400)
        .json({ message: "Name and target amount are required" });
    }

    const currentAmount = current_amount || 0;

    const query = `
            INSERT INTO 
                goals (
                    name, 
                    target_amount, 
                    current_amount, 
                    user_id, 
                    category_id, 
                    created_at
                ) 
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
            `;

    const { rows } = await client.query(query, [
      name,
      target_amount,
      currentAmount,
      user_id,
      category_id,
    ]);

    const newGoal = rows[0];

    if (images && Array.isArray(images) && images.length > 0) {
      const imagePromises = images.map((item) => {
        return client.query(
          `
                    INSERT INTO 
                        images (
                            goal_id, 
                            user_id, 
                            asset_id, 
                            public_id, 
                            url, 
                            secure_url, 
                            created_at
                        ) 
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    `,
          [
            newGoal.id,
            user_id,
            item.asset_id,
            item.public_id,
            item.url,
            item.secure_url,
          ],
        );
      });

      await Promise.all(imagePromises);
    }

    res.status(201).json(newGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      target_amount,
      current_amount,
      user_id,
      category_id,
      images,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    if (!name || !target_amount || !user_id || !current_amount) {
      return res.status(400).json({ message: "All field are required" });
    }

    // clear images
    await client.query(
      `
            DELETE FROM
                images
            WHERE 
                goal_id = $1
            `,
      [id],
    );

    const query = `
            UPDATE 
                goals 
            SET
                name = $1,
                target_amount = $2,
                current_amount = $3,
                user_id = $4,
                updated_at = NOW(),
                category_id = $5
            WHERE 
                id = $6
            RETURNING *
        `;

    const { rows } = await client.query(query, [
      name,
      target_amount,
      current_amount,
      user_id,
      category_id,
      id,
    ]);

    const updateGoal = rows[0];

    if (images && Array.isArray(images) && images.length > 0) {
      const imagesPromises = images.map((item) => {
        return client.query(
          `
                    INSERT INTO 
                        images (
                            asset_id,
                            public_id,
                            url,
                            secure_url,
                            goal_id,
                            user_id,
                            updated_at
                        ) 
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    `,
          [
            item.asset_id,
            item.public_id,
            item.url,
            item.secure_url,
            updateGoal.id,
            user_id,
          ],
        );
      });

      await Promise.all(imagesPromises);
    }

    res.status(200).json(updateGoal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const { rows } = await client.query("DELETE FROM goals WHERE id = $1", [
      id,
    ]);
    const data = rows[0];

    // if there is no data, it will return undefined.
    if (!data) {
      return res
        .status(404)
        .json({ message: "The Id to delete was not found" });
    }

    res.send("Deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
