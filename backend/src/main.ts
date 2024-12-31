function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function startGreetingServer() {
  const server = Deno.serve((_req) => {
    return new Response(greet("World"));
  });
  return server;
}

function main() {
  // nothing to see here
}

main();
