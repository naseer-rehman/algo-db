import db from "../utils/db";

export interface User {
  username: string;
  id: number;
};

export async function getAllUsers() {
  const result = await db.query(`SELECT id, github_username AS username FROM users LIMIT 1000;`);
  return result.rows.map(([id, username]: [string, number]) => {
    return {id, username};
  });
}