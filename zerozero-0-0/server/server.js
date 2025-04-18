import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import { cors } from "hono/cors";
import * as v from "valibot";

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

const TodoSchema = v.string({
  title: v.string(),
});

app.post("/todo", vValidator("json", TodoSchema),  (c) => {
  const data = c.req.valid("json");

  console.log(data);

  const title = data.title;
  if (!title) {
    throw new Error("Title is required");
  }

  console.log(title);

  const newTodo = {
    id: String(++currentId),
    title,
    completed: false,
  };

  todos.push(newTodo);
  return c.json({ success: true, todo: newTodo }, 200);
});

serve({
  fetch: app.fetch,
  port: 8000,
});
