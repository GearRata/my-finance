import jwt from "jsonwebtoken";
import { client } from "../src/config/db.js";

export const authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(401).json({ message: "No Token, Authorization" });
    }
    const token = headerToken.split(" ")[1];

    // ถอดรหัส token ได้ข้อมูล { id, email }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const query = `
            SELECT 
                id, email, created_at, role, enabled
            FROM 
                users
            WHERE 
                email = $1
        `;
    const { rows } = await client.query(query, [decoded.email]);
    const currentUser = rows[0];

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.enabled) {
      return res.status(400).json({ message: "This account cannot access" });
    }

    // req จะเก็บข้อมูล object ของ currentUser เ
    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Token Invalid" });
  }
};

export const adminCheck = async (req, res, next) => {
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
