import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

const todoList = [
  { id: 1, title: "JavaScriptを勉強する", completed: false },
  { id: 2, title: "CTFのWriteupを書く", completed: false },
  { id: 3, title: "学校の課題を提出する", completed: true },
];

app.get("/todo", (c) => {
  return c.json(todoList);
});

console.log("Server is listening on port 8000");

serve({
  fetch: app.fetch,
  port: 8000,
});
