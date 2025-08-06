// Connects to postgresql database
import { Client } from "pg";

const database = new Client({
  host: Bun.env.DB_HOST,
  user: Bun.env.DB_USER,
  password: Bun.env.DB_PASSWORD,
  port: parseInt(Bun.env.DB_PORT ?? ""),
  database: Bun.env.DB_NAME,
});

await database.connect();

export default database;
