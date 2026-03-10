import jwt from "jsonwebtoken";
import { client } from "../config/db.js";
import type { Request, Response, NextFunction } from "express";

interface UserRow {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
  created_at: Date;
}

// // ระบุโครงสร้างของ Payload ด้านในให้ TypeScript รู้
// interface TokenPayload extends jwt.JwtPayload {
//   id: number;
//   email: string;
// }

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
                id, email, created_at, role, enabled
            FROM 
                users
            WHERE 
                email = $1
        `;

    const { rows } = await client.query(query, [decoded.email]);
    const currentUser = rows[0] as UserRow;

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.enabled) {
      return res.status(400).json({ message: "This account cannot access" });
    }

    // req จะเก็บข้อมูล object ของ currentUser
    req.user = currentUser;
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
