import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors({ origin: "*" }));

const todoList = [
    { id: 1, title: "JavaScriptを勉強する", completed: false }, 
    { id: 2, title: "CTFのWriteupを書く", completed: false }, 
    { id: 3, title: "学校の課題を提出する", completed: true }
];
// TODOリストの取得
app.get("/todo", (c) => c.json(todoList, 200));


serve({
    fetch: app.fetch,
    port: 8000,
  });

