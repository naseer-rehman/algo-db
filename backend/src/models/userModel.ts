import db from "../utils/db.ts";

export interface User {
  username: string;
  id: number;
};

export function getAllUsers() {
  const result = db.query(`SELECT * FROM users;`);
  return result.map(([id, username]: [string, number]) => {
    return {id, username};
  });
}