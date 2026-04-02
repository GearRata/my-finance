import { client } from "../config/db.js";

export const getAccountsByUserId = async (user_id: number | string) => {
  const { rows } = await client.query(
    "SELECT * FROM accounts WHERE user_id = $1",
    [user_id],
  );
  return rows;
};

export const createAccount = async (
  name: string,
  balance: number | string,
  user_id: number | string,
) => {
  const { rows } = await client.query(
    "INSERT INTO accounts (name, balance, user_id, created_at) VALUES ($1, $2, $3, NOW())",
    [name, balance, user_id],
  );
  return rows;
};

export const updateAccount = async (
  id: string | string[],
  name: string,
  balance: number | string,
  user_id: number | string,
) => {
  const { rows } = await client.query(
    "UPDATE accounts SET name = $1, balance = $2, user_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
    [name, balance, user_id, id],
  );
  return rows[0];
};

export const deleteAccount = async (id: string | string[]) => {
  const { rows } = await client.query(
    "DELETE FROM accounts WHERE id = $1 RETURNING *",
    [id],
  );
  return rows[0];
};
