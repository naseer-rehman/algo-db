// Connects to postgresql database
import { Pool } from "pg";

export const pool = new Pool({
  host: Bun.env.DB_HOST,
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASSWORD,
  port: parseInt(Bun.env.DB_PORT ?? ""),
  database: Bun.env.DB_NAME,
});

// TODO: If using a centralized, wrapped query function, then I gotta
//       set type definitions correctly...
// export const query = async (text: string, values?: any[]) => {
//   return pool.query(text, values); 
// };

export default pool;