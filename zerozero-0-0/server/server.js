import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

const todos = [
  { id: 1, title: "JavaScriptを勉強する", completed: false },
  { id: 2, title: "CTFのWriteupを書く", completed: false },
  { id: 3, title: "学校の課題を提出する", completed: true },
];

let currentId = todos.length;

app.get("/todo", (c) => {
  return c.json(todos, 200);
});

app.post ("/todo", async (c) => {
  const { title } = await c.req.json();

  if (!title) {
    throw new Error("Title is required");
  }

  const newTodo = {
    id: String(++currentId),
    title,
    completed: false,
  }

  todos.push(newTodo);
  return c.json({ success: true, todo: newTodo}, 200);
});

serve({
  fetch: app.fetch,
  port: 8000
});
