import { client } from "../config/db.js";

export const findUserByEmail = async (email: string) => {
  const query = `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        email = $1
    `;
  const { rows } = await client.query(query, [email]);
  return rows[0];
};

export const createUser = async (
  username: string,
  email: string,
  hashPassword: string,
) => {
  const query = `
      INSERT INTO 
        users (
          username,
          email, 
          password, 
          created_at
        ) 
        VALUES (
          $1, 
          $2,
          $3, 
          NOW()
        )
      RETURNING *;
    `;
  const { rows } = await client.query(query, [username, email, hashPassword]);
  return rows[0];
};
