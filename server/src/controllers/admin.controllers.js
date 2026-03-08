import { client } from "../config/db.js";

export const listUsers = async (req, res) => {
  try {
    const query = `
      SELECT
        id, email, created_at, role, enabled
      FROM
        users
    `;
    const { rows } = await client.query(query);

    res.json({ message: "ok", data: rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    const query = `
      UPDATE
        users
      SET
        enabled = $1
      WHERE 
        id = $2
    `;
    const { rows } = await client.query(query, [enabled, id]);
    res.json({ message: "Update Status Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const query = `
      UPDATE
        users
      SET
        role = $1
      WHERE
        id = $2
    `;

    const { rows } = await client.query(query, [role, id]);

    res.send("Update Role Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
