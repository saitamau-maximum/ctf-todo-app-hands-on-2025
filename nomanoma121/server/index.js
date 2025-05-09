import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { vValidator } from "@hono/valibot-validator";
import { string, object, boolean } from "valibot";
import sqlite3 from "sqlite3";
import { Todo } from "./queries.js";

const app = new Hono();
const db = new sqlite3.Database("../db/todo.db");

app.use(cors({ origin: "*" }));

const todoListSeed = [
  { title: "JavaScriptを勉強する", completed: false },
  { title: "CTFのWriteupを書く", completed: false },
  { title: "学校の課題を提出する", completed: true },
];

db.serialize(() => {
  db.run(Todo.createTable, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table created successfully");
    }
  });

  todoListSeed.forEach((todo) => {
    db.run(Todo.insert, todo.title, todo.completed ? 1 : 0, (err) => {
      if (err) {
        console.error("Error inserting seed data:", err);
      }
    });
  });
});

const Schema = object({
  title: string(),
  completed: boolean(),
});

const validateParam = (id) => {
  const todoId = Number(id);
  if (!Number.isInteger(todoId) || String(todoId) !== id || todoId <= 0) {
    return {
      success: false,
      message: "Invalid ID",
    };
  }
  return { success: true };
};

app.get("/todo", async (c) => {
  try {
    const todos = await new Promise((resolve, reject) => {
      db.all(Todo.selectAll, function (err, rows) {
        if (err) {
          console.error("Error fetching todos:", err);
          reject(err);
        } else {
          resolve(
            rows.map((row) => ({ ...row, completed: Boolean(row.completed) }))
          );
        }
      });
    });

    return c.json(todos, 200);
  } catch (error) {
    throw new HTTPException(500, { message: error.message });
  }
});

app.post("/todo", vValidator("json", Schema), async (c) => {
  const { title, completed } = c.req.valid("json");
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(Todo.insert, title, completed ? 1 : 0, function (err) {
        if (err) {
          console.error("Error inserting todo:", err);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
    return c.json(
      {
        success: true,
        id: result,
      },
      200
    );
  } catch (error) {
    throw new HTTPException(500, { message: error.message });
  }
});

app.put("/todo/:id", vValidator("json", Schema), async (c) => {
  const { id } = c.req.param();
  const { title, completed } = c.req.valid("json");
  const todoId = Number(id);
  if (!validateParam(id).success) {
    throw new HTTPException(400, {
      message: "Invalid ID",
    });
  }
  try {
    const result = await new Promise((resolve, reject) => {
      db.run(Todo.update, title, completed ? 1 : 0, todoId, function (err) {
        if (err) {
          console.error("Error updating todo:", err);
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
    if (result === null || result === 0) {
      throw new HTTPException(404, {
        message: "Todo not found",
      });
    }
    return c.json(
      {
        success: true,
        id: todoId,
      },
      200
    );
  } catch (error) {
    throw new HTTPException(500, { message: error.message });
  }
});

app.delete("/todo/:id", async (c) => {
  const { id } = c.req.param();
  const todoId = Number(id);
  if (!validateParam(id).success) {
    throw new HTTPException(400, {
      message: "Invalid ID",
    }); 
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(Todo.delete, todoId, function (err) {
        if (err) {
          console.error("Error deleting todo:", err);
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
    if (result === null || result === 0) {
      throw new HTTPException(404, {
        message: "Todo not found",
      });
    }
    return c.json(
      {
        success: true,
        id: todoId,
      },
      200
    );
  } catch (error) {
    throw new HTTPException(500, { message: error.message });
  }
});

app.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  } else {
    console.error("Unexpected error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server is listening on port 8000");

serve({
  fetch: app.fetch,
  port: 8000,
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("Database connection closed.");
    process.exit(0);
  });
});
