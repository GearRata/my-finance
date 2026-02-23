import { client } from "../config/db.js";


export const list = async (req, res) => {
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
        res.send(rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const create = async (req, res) => {
    try {
        const { amount, note, user_id, account_id, category_id } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const query = `
            INSERT INTO 
                transactions (
                    amount, 
                    note, 
                    user_id, 
                    account_id, 
                    category_id, 
                    transaction_date, 
                    created_at
                ) 
            VALUES (
                $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *
            `

        const { rows } = await client.query(query, [amount, note, user_id, account_id, category_id,])


        res.status(201).json(rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const update = async (req, res) => {
    try {
        res.send('updated')
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const remove = async (req, res) => {
    try {
        res.send('deleted')
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}