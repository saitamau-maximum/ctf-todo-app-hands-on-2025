import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import { cors } from "hono/cors";
import * as v from "valibot";

const app = new Hono();

const TodoSchema = v.object({
  title: v.string(),
});

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

app.post("/todo", vValidator("json", TodoSchema), (c) => {
  const { title } = c.req.valid("json");

  if (!title) {
    return c.json(
      {
        success: false,
        message: "タイトルは必須です",
      },
      400
    );
  }

  console.log(title);

  const newTodo = {
    id: ++currentId,
    title: title,
    completed: false,
  };

  todos.push(newTodo);
  return c.json(
    {
      success: true,
      id: currentId,
    },
    201
  );
});

serve({
  fetch: app.fetch,
  port: 8000,
});
