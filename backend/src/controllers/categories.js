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
        const { rows } = await client.query('INSERT INTO categories (name, type, created_at) VALUES ($1, $2, NOW()) RETURNING *', [name, type])
        console.log(rows);
        res.send("created");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await client.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
        const category = rows[0];
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.send("removed");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}