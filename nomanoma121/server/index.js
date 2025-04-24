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

const Schema = object({
  title: string(),
  completed: boolean(),
});

app.get("/todo", (c) => {
  return c.json(todoList);
});

app.post("/todo", vValidator("json", Schema), (c) => {
  const { title, completed } = c.req.valid("json");
  const newTodo = {
    id: todoList.reduce((max, todo) => Math.max(max, todo.id), 0) + 1, 
    title,
    completed,
  };
  todoList.push(newTodo);

  return c.json({
    success: true,
    id: newTodo.id,
  }, 200);
});

app.put("/todo/:id", vValidator("json", Schema), (c) => {
  const { id } = c.req.param();
  const { title, completed } = c.req.valid("json");
  const todoIndex = todoList.findIndex((todo) => todo.id === Number.parseInt(id));

  if (todoIndex === -1) {
    return c.json({
      success: false,
      message: "Todo not found",
    }, 404);
  }

  todoList[todoIndex] = {
    ...todoList[todoIndex],
    title,
    completed,
  };

  return c.json({
    success: true,
    id: Number.parseInt(id),
  }, 200);
});

app.delete("/todo/:id", (c) => {
  const { id } = c.req.param();
  const todoIndex = todoList.findIndex((todo) => todo.id === Number.parseInt(id));

  if (todoIndex === -1) {
    return c.json({
      success: false,
      message: "Todo not found",
    }, 404);
  }

  todoList.splice(todoIndex, 1);

  return c.json({
    success: true,
    id: Number.parseInt(id),
  }, 200);
});

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json({
    success: false,
    message: "Internal Server Error",
  }, 500);
});

console.log("Server is listening on port 8000");

serve({
  fetch: app.fetch,
  port: 8000,
});
