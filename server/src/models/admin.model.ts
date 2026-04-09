import { client } from "../config/db.js";

export const getAllUsers = async () => {
  const query = `
      SELECT
        id, email, created_at, role, enabled
      FROM
        users
    `;
  const { rows } = await client.query(query);
  return rows;
};

export const updateUserStatus = async (id: number | string, enabled: boolean) => {
  const query = `
      UPDATE
        users
      SET
        enabled = $1
      WHERE 
        id = $2
    `;
  await client.query(query, [enabled, id]);
};

export const updateUserRole = async (id: number | string, role: string) => {
  const query = `
      UPDATE
        users
      SET
        role = $1
      WHERE
        id = $2
    `;
  await client.query(query, [role, id]);
};
