import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { vValidator } from "@hono/valibot-validator";
import { string, object, boolean } from "valibot";

const app = new Hono();

app.use(cors({ origin: "*" }));

const todoList = [
  { id: 1, title: "JavaScriptを勉強する", completed: false },
  { id: 2, title: "CTFのWriteupを書く", completed: false },
  { id: 3, title: "学校の課題を提出する", completed: true },
];

const schema = object({
  title: string(),
  completed: boolean(),
});

app.get("/todo", (c) => {
  return c.json(todoList);
});

app.post("/todo", vValidator("json", schema), (c) => {
  const { title, completed } = c.req.valid("json");
  const newTodo = {
    id: todoList.length + 1,
    title,
    completed,
  };
  todoList.push(newTodo);

  return c.json({
    success: true,
    id: newTodo.id,
  });
});

console.log("Server is listening on port 8000");

serve({
  fetch: app.fetch,
  port: 8000,
});
