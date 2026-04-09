import { client } from "../config/db.js";

export const getAllCategories = async () => {
  const { rows } = await client.query("SELECT * FROM categories");
  return rows;
};

export const createCategory = async (name: string, type: string) => {
  const { rows } = await client.query(
    "INSERT INTO categories (name, type, created_at) VALUES ($1, $2, NOW()) RETURNING *",
    [name, type],
  );
  return rows[0];
};

export const updateCategory = async (id: number | string, name: string, type: string) => {
  const { rows } = await client.query(
    "UPDATE categories SET name = $1, type = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
    [name, type, id],
  );
  return rows[0];
};

export const deleteCategory = async (id: number | string) => {
  const { rows } = await client.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0];
};
