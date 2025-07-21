import express from "express";
import process from "node:process";

function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function startGreetingServer() {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hello, World!");
  });
  app.get("/close", (_req, res) => {
    res.sendStatus(200);
  });
  return app.listen(process.env.PORT || 8000);
}

function main() {
  // nothing to see here
  console.log("Running!");
  const server = startGreetingServer();
  server.on("close", () => {
    console.log("Server closed.");
  });
  process.on("SIGINT", () => {
    server.close();
  });
}

main();
