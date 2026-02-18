import { client } from '../config/db.js'

export const list = async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM goals');
        res.send(rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const create = async (req, res) => {
    try {
        const { name, target_amount, current_amount, user_id } = req.body;

        if (!name || !target_amount || !user_id) {
            return res.status(400).json({ message: 'Name and target amount are required' })
        }

        const currentAmount = current_amount || 0;
        await client.query('INSERT INTO goals (name, target_amount, current_amount, user_id, created_at) VALUES ($1, $2, $3, $4, NOW())', [name, target_amount, currentAmount, user_id])

        res.send('Created')

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, target_amount, current_amount, user_id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Id is required' })
        }

        if (!name || !target_amount || !user_id || !current_amount) {
            return res.status(400).json({ message: 'All field are required' })
        }

        const { rows } = await client.query('SELECT * FROM goals WHERE id = $1', [id]);
        const data = rows[0]

        if (!data) {
            return res.status(404).json({ message: 'The Id to update was not found' })
        }

        await client.query('UPDATE goals SET name = $1, target_amount = $2, current_amount = $3, user_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *', [name, target_amount, current_amount, user_id, id]);
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }

        const { rows } = await client.query('SELECT * FROM goals WHERE id = $1', [id]);
        const data = rows[0];

        if (!data) {
            return res.status(404).json({ message: 'The Id to delete was not found' })
        }

        await client.query('DELETE FROM goals WHERE id = $1', [id]);
        res.send('Deleted');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}