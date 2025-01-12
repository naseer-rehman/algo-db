// Connects to postgresql database
import { Client } from "https://deno.land/x/postgres/mod.ts";

const database = new Client({
  user: Deno.env.get("DB_USER"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOSTNAME"),
  password: Deno.env.get("DB_PASSWORD"),
  port: parseInt(Deno.env.get("DB_PORT") ?? ""),
});

await database.connect();

export default database;