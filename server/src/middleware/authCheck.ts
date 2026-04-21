import jwt from "jsonwebtoken";
import { client } from "../config/db.js";
import type { Request, Response, NextFunction } from "express";

interface UserRow {
  id: number;
  username: string;
  email: string;
  role: string;
  enabled: boolean;
  has_account?: number;
}

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // อ่าน token จาก cookie
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No Token, Authorization Denied" });
    }

    // Decode ของ token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;

    const query = `
          SELECT
              u.id, 
              u.username, 
              u.email, 
              u.role, 
              u.enabled,
              COUNT(a.id)::int as has_account
          FROM users u
          LEFT JOIN accounts a ON a.user_id = u.id
          WHERE email = $1
          GROUP BY u.id
        `;

    const { rows } = await client.query(query, [decoded.email]);
    const currentUser = rows[0] as UserRow;

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.enabled) {
      return res.status(400).json({ message: "This account cannot access" });
    }

    const { has_account, ...userData } = currentUser;

    req.user = userData;
    req.has_account = has_account;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Token Invalid" });
  }
};

export const adminCheck = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // req.user ถูกเซ็ตไว้แล้วนำมา check role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admin only" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Admin access denied" });
  }
};
