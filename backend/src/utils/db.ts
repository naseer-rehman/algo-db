// Connects to postgresql database
import { Client } from "pg";


const database = new Client({
  host: Bun.env.DB_HOSTNAME,
  password: Bun.env.DB_PASSWORD,
  port: parseInt(Bun.env.DB_PORT ?? ""),
});

await database.connect();

export default database;