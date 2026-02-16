import { client } from "../config/db.js"

export const list = async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM accounts');
        res.send(rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const create = async (req, res) => {
    try {
        const { name, balance, user_id } = req.body;

        // Validate request
        if (!name || !balance) {
            return res.status(400).json({ message: 'name and balance are required' })
        }

        // Create new Account
        await client.query('INSERT INTO accounts (name, balance, user_id, created_at) VALUES ($1, $2, $3, NOW())', [name, balance, user_id])

        res.send('Create Account');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const remove = async (req, res) => {
    try {

        const { id } = req.params;
        const { rows } = await client.query('DELETE FROM accounts WHERE id = $1 RETURNING *', [id]);
        const account = rows[0];

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.send('Delete Account');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' })
    }
}