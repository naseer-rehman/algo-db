import { assertEquals } from "@std/assert";
import { startGreetingServer } from "../src/main.ts";

Deno.test(async function addTest() {
  const server = startGreetingServer();
  const resp = await fetch("http://0.0.0.0:8000");
  const msg = await resp.text();
  assertEquals(msg, "Hello, World!");
  server.shutdown();
});
