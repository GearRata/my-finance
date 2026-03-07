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

export const listby = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;
        const query = `
            SELECT 
                *
            FROM transactions
            ORDER BY ${sort} ${order.toUpperCase()}
            LIMIT $1
        `
        const { rows } = await client.query(query, [limit]);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

const handleName = async (req, res, name) => {
    try {
        const query = `
           SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.note ILIKE $1
            ORDER BY t.created_at DESC
        `;
        const { rows } = await client.query(query, [`%${name}%`]);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Search Error' });
    }
}

const handleAmount = async (req, res, amount) => {
    try {
        // amount เป็น array [min, max] เช่น [1000, 5000]
        const query = `
            SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE
                t.amount BETWEEN $1 AND $2
            ORDER BY
                t.amount DESC
        `;
        const { rows } = await client.query(query, [amount[0], amount[1]]);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Search Error' });
    }
}

const handleCategory = async (req, res, category) => {
    try {

        const query = `
            SELECT
                t.*,
                jsonb_build_object(
                    'id', a.id,
                    'name', a.name,
                    'balance', a.balance
                ) AS accounts,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type
                ) AS categories
            FROM transactions t
            LEFT JOIN accounts a ON t.account_id = a.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE
                t.category_id = ANY($1::int[])
            ORDER BY
                t.created_at DESC
        `;
        const { rows } = await client.query(query, [category]);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Search Error' });
    }
}



export const searchFilter = async (req, res) => {
    try {
        const { name, category, amount } = req.body;
        console.log(req.body)


        if (name) {
            console.log('Query --->', name);
            await handleName(req, res, name);
        }
        if (category) {
            console.log('category --->', category);
            await handleCategory(req, res, category)

        }
        if (amount) {
            console.log('amount --->', amount);
            await handleAmount(req, res, amount);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}