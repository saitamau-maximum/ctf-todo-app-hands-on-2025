import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const todos = [
  { id: 1, title: "JavaScriptを勉強する", completed: false },
  { id: 2, title: "CTFのWriteupを書く", completed: false },
  { id: 3, title: "学校の課題を提出する", completed: true },
];

app.get("/", (c) => {
  return c.json(todos, 200);
});

serve({
    fetch: app.fetch,
    port: 8000,
}
)