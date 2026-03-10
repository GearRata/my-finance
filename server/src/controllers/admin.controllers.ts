import type { Request, Response } from "express";
import { client } from "../config/db.js";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        id, email, created_at, role, enabled
      FROM
        users
    `;
    const { rows } = await client.query(query);

    res.json({ message: "ok", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const { id, enabled } = req.body;
    const errors: { field: string; detail: string }[] = [];
    if (!id) {
      errors.push({ field: "id", detail: "id is required." });
    }

    if (typeof enabled !== "boolean") {
      errors.push({
        field: "enabled",
        detail: "enabled is required and must be boolean.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid request", errors });
    }

    const query = `
      UPDATE
        users
      SET
        enabled = $1
      WHERE 
        id = $2
    `;
    await client.query(query, [enabled, id]);
    res.json({ message: "Update Status Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    const { id, role } = req.body;
    const errors: { field: string; detail: string }[] = [];

    if (!id) {
      errors.push({ field: "id", detail: "id is required." });
    }

    if (!role) {
      errors.push({ field: "role", detail: "role is required." });
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid request", errors });
    }
    const query = `
      UPDATE
        users
      SET
        role = $1
      WHERE
        id = $2
    `;

    await client.query(query, [role, id]);

    res.send("Update Role Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
