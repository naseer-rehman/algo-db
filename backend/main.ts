function greet(name: string): string {
  return `Hello, ${name}!`;
}

function main() {
  const msg = greet("world");
  console.log(msg);
}

main();