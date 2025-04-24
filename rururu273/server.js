import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// CORSの設定
app.use(cors({ origin: "*" }));

// ルートパスにアクセスしたときの処理
app.get("/", (c) => {
  return c.text("Hello, Hono.js!");
});

serve({
  fetch: app.fetch,
  port: 8000,
});
