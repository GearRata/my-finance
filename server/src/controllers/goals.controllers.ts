import type { NextFunction, Request, Response } from "express";
import { client } from "../config/db.js";
import { sendSuccess, sendFail, sendError } from "../utils/apiResponse.js";
import cloudinary from "../utils/cloudinary.js";

export const list = async (req: Request, res: Response) => {
  try {
    const { count } = req.params;

    const query = `
            SELECT
                goals.*,
                (
                    -- COALESCE ถ้ามีข้อมูลจะใช้ค่านั้น แต่ถ้าหากข้อมูลนั้นเป็น NULL จะไปใช้ข้อมูลถัดไป
                    -- jsonb_agg รวบรวมค่าทั้งหมดรวมถึง null ลงใน JSON array
                    SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
                    FROM images i 
                    WHERE i.goal_id = goals.id
                ) AS images
            FROM goals  
            ORDER BY goals.created_at DESC
            LIMIT $1
        `;
    const { rows } = await client.query(query, [count]);
    return sendSuccess(res, rows, "List Goals");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const listAll = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT 
        goals.*,
        (
            SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
            FROM images i 
            WHERE i.goal_id = goals.id
        ) AS images
      FROM goals 
      WHERE user_id = $1
      ORDER BY goals.created_at DESC
    `;
    const { rows } = await client.query(query, [user_id]);
    return sendSuccess(res, rows, "List Goals");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const total = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        COALESCE(SUM(target_amount), 0) AS total_target,
        COALESCE(SUM(current_amount), 0) AS total_saved
      FROM goals g
      WHERE user_id = $1;
    `;
    const { rows } = await client.query(query, [user_id]);

    const changType = rows.map((row) => {
      return {
        total_target: Number(row.total_target),
        total_saved: Number(row.total_saved),
      };
    });
    const data = changType[0];
    return sendSuccess(res, data, "Total");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const read = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendFail(res, "Id is required", "VALIDATION_ERROR", null, 400);
    }

    const query = `
            SELECT
                goals.*,
                (
                    -- COALESCE ถ้ามีข้อมูลจะใช้ค่านั้น แต่ถ้าหากข้อมูลนั้นเป็น NULL จะไปใช้ข้อมูลถัดไป
                    -- jsonb_agg รวบรวมค่าทั้งหมดรวมถึง null ลงใน JSON array
                    SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
                    FROM images i 
                    WHERE i.goal_id = goals.id
                ) AS images
            FROM goals
            WHERE
                goals.id = $1
        `;
    const { rows } = await client.query(query, [id]);
    return sendSuccess(res, rows, `Goal ID ${id}`);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user_id = req.user.id;
    const { name, target_amount, current_amount, due_date, images } = req.body;
    console.log(images);

    if (!name || !target_amount || !user_id) {
      return sendFail(
        res,
        "Name and target amount are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
    }

    const currentAmount = current_amount || 0;

    const query = `
            INSERT INTO
                goals (
                    name,
                    target_amount,
                    current_amount,
                    user_id,
                    due_date,
                    created_at
                )
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
            `;

    const { rows } = await client.query(query, [
      name,
      target_amount,
      currentAmount,
      user_id,
      due_date,
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

    return sendSuccess(res, newGoal, "Goal created", 201);
    res.send(req.file);
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, target_amount, current_amount, user_id, due_date, images } =
      req.body;

    if (!id) {
      return sendFail(res, "Id is required", "VALIDATION_ERROR", null, 400);
    }

    if (!name || !target_amount || !user_id || !current_amount) {
      return sendFail(
        res,
        "All fields are required",
        "VALIDATION_ERROR",
        null,
        400,
      );
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
                due_date = $5
            WHERE 
                id = $6
            RETURNING *
        `;

    const { rows } = await client.query(query, [
      name,
      target_amount,
      current_amount,
      user_id,
      due_date,
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

    return sendSuccess(res, updateGoal, "Goal updated");
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
      "DELETE FROM goals WHERE id = $1 RETURNING *",
      [id],
    );
    const data = rows[0];

    // if there is no data, it will return undefined.
    if (!data) {
      return sendFail(
        res,
        "The Id to delete was not found",
        "NOT_FOUND",
        null,
        404,
      );
    }

    return sendSuccess(res, null, "Deleted");
  } catch (error) {
    console.log(error);
    return sendError(res);
  }
};

export const uploadImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const images = (req.files as Express.Multer.File[]) || [];
    const imageUrls = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });

      imageUrls.push({
        asset_id: result.asset_id,
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
      });
    }

    // ยัด imageUrls กลับเข้าไปใน req.body.images จะได้ตรงกับที่ดึงออกมาใน create และ update
    req.body.images = imageUrls;

    // เรียก next() แค่ครั้งเดียวหลังจากอัปโหลดครบแล้ว (หรือไม่มีรูปก็ผ่านไปได้)
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// https://cloudinary.com/documentation/image_upload_api_reference#upload_response
