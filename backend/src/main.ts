import express from "express";

function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function startGreetingServer() {
  const app = express();
  app.get("/", (_req, res) => {
    res.send("Hello, World!");
  });
  return app.listen(8000);
}

function main() {
  // nothing to see here
  console.log("Running!");
}

main();
