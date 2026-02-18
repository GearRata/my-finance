import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "../config/db.js"

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        // ถ้าไม่ได้ส่ง email หรือ password มาก็จะเป็น false และเจอะ not ก็จะเป็น true ทำให้ if ทำงาน
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if email already exists
        const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0]

        if (user) {
            return res.status(400).json({ message: 'Email already exists' })
        }
        // Hash password (นำรหัสมาเข้ารหัสแบบทางเดียวและ salt เพิ่มเข้าไป)
        const hashPassword = await bcrypt.hash(password, 10);

        // Create New User
        await client.query('INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW())', [email, hashPassword])

        res.send('Register Success')
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate request
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is not correct' })
        }

        // Create Payload
        const payload = {
            id: user.id,
            email: user.email,
        }

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json({ payload, token });
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const currentUser = async (req, res) => {
    try {
        res.send("Current User");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}