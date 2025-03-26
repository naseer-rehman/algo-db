import { expect, test } from "bun:test";
import { startGreetingServer } from "../src/main.ts";

test("Hello World Server", async function addTest() {
  const server = startGreetingServer();
  const resp = await fetch("http://0.0.0.0:8000");
  const msg = await resp.text();
  expect(msg).toBe("Hello, World!");
  server.close();
});
