FROM denoland/deno:2.1.4

EXPOSE 8080

WORKDIR /app

COPY deno.json .
COPY deno.lock .
RUN deno install

COPY . .
CMD ["task", "start"]
