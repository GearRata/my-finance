import { client } from "../config/db.js"


export const list = async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM categories');
        res.send(rows)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const create = async (req, res) => {
    try {
        const { name, type } = req.body;
        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' })
        }
        const { rows } = await client.query('INSERT INTO categories (name, type, created_at) VALUES ($1, $2, NOW()) RETURNING *', [name, type])
        console.log(rows);
        res.send("created");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type } = req.body;
        if (!id) {
            return res.status(400).json({ message: 'Id is required' });
        }
        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' })
        }
        const { rows } = await client.query('UPDATE categories SET name = $1, type = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [name, type, id]);
        const updatedCategory = rows[0];
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' })
        }
        res.json(updatedCategory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Id is required' })
        }
        const { rows } = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        const DeleteCategory = rows[0];
        if (!DeleteCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.send("removed");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}