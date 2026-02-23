import { client } from '../config/db.js'

export const list = async (req, res) => {
    try {
        const { count } = req.params;

        const query = `
            SELECT
                goals.*,
                jsonb_build_object(
                    'id', c.id,
                    'name', c.name,
                    'type', c.type,
                    'created_at', c.created_at,
                    'updated_at', c.updated_at
                ) AS categories,
                (
                    -- COALESCE ถ้ามีข้อมูลจะใช้ค่านั้น แต่ถ้าหากข้อมูลนั้นเป็น NULL จะไปใช้ข้อมูลถัดไป
                    -- jsonb_agg รวบรวมค่าทั้งหมดรวมถึง null ลงใน JSON array
                    SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
                    FROM images i 
                    WHERE i.goal_id = goals.id
                ) AS images
            FROM goals
            LEFT JOIN categories c ON goals.category_id = c.id
            ORDER BY goals.created_at DESC
            LIMIT $1
        `;
        const { rows } = await client.query(query, [count])
        res.json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const create = async (req, res) => {
    try {
        const { name, target_amount, current_amount, user_id, category_id, images } = req.body;

        if (!name || !target_amount || !user_id) {
            return res.status(400).json({ message: 'Name and target amount are required' })
        }

        const currentAmount = current_amount || 0;

        const { rows } = await client.query(
            'INSERT INTO goals (name, target_amount, current_amount, user_id, category_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [name, target_amount, currentAmount, user_id, category_id]
        );

        const newGoal = rows[0];

        if (images && Array.isArray(images) && images.length > 0) {
            const imagePromises = images.map((item) => {
                return client.query(
                    `INSERT INTO images 
                    (goal_id, user_id, asset_id, public_id, url, secure_url, created_at) 
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
                    [
                        newGoal.id,
                        user_id,
                        item.asset_id,
                        item.public_id,
                        item.url,
                        item.secure_url
                    ]
                );
            });

            await Promise.all(imagePromises);
        }

        res.status(201).json(newGoal);

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

        const { rows } = await client.query('UPDATE goals SET name = $1, target_amount = $2, current_amount = $3, user_id = $4, updated_at = NOW() WHERE id = $5 RETURNING *', [name, target_amount, current_amount, user_id, id]);
        const data = rows[0];

        if (!data) {
            return res.status(404).json({ message: 'The Id to update was not found' })
        }

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

        const { rows } = await client.query('DELETE FROM goals WHERE id = $1', [id]);
        const data = rows[0];

        // if there is no data, it will return undefined.
        if (!data) {
            return res.status(404).json({ message: 'The Id to delete was not found' })
        }

        res.send('Deleted');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}