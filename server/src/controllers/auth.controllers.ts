import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../config/db.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request
    const errors: { field: string; detail: string }[] = [];

    // ตรวจสอบรูปแบบ email และ password
    if (!email) {
      errors.push({ field: "email", detail: "email is required." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: "email", detail: "email is invalid format." });
    }

    if (!password) {
      errors.push({ field: "password", detail: "password is required." });
    } else if (password.length < 6) {
      errors.push({
        field: "password",
        detail: "password must be at least 6 characters.",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid", errors });
    }

    // Check if email already exists (ตรวจสอบว่าอีเมลนี้มีอยู่แล้วหรือไม่)
    const query = `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        email = $1
    `;
    const { rows } = await client.query(query, [email]);
    const user = rows[0];

    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password (นำรหัสมาเข้ารหัสแบบทางเดียวและ salt เพิ่มเข้าไป)
    const hashPassword = await bcrypt.hash(password, 10);

    // Create New User
    await client.query(
      `
			INSERT INTO 
				users (
					email, 
					password, 
					created_at
				) 
				VALUES (
					$1, 
					$2, 
					NOW()
				)
			`,
      [email, hashPassword],
    );

    res.send("Register Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate request
    const errors: { field: string; detail: string }[] = [];

    // ตรวจสอบรูปแบบ email และ password
    if (!email) {
      errors.push({ field: "email", detail: "email is required." });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: "email", detail: "email is invalid format." });
    }

    if (!password) {
      errors.push({ field: "password", detail: "password is required." });
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Invalid", errors });
    }

    // Check if user exists
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    const user = rows[0];

    // เช็ค user ว่าเจอไหม
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // เช็ค user ว่าได้ status เป็น enabled ยัง
    if (!user.enabled) {
      return res.status(400).json({ message: "User not enabled" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is not correct" });
    }

    // Create Payload
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Create JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: "5h" },
      (err, token) => {
        if (err || !token) {
          return res.status(500).json({ message: "Internal server error" });
        }

        // Response ให้เก็บ cookie ไว้บน Browser
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
          sameSite: "none",
        });

        res.json({ message: "Login Success", payload });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logout Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  try {
    // authCheck ดึงข้อมูลมาใส่ req.user ไว้แล้ว
    res.json({ message: "ok", data: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
