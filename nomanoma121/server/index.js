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
  { id: 1, title: "JavaScriptを勉強する", completed: false },
  { id: 2, title: "CTFのWriteupを書く", completed: false },
  { id: 3, title: "学校の課題を提出する", completed: true },
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
        resolve(rows.map((row) => ({ ...row, completed: Boolean(row.completed) })));
        }
      });
    });

    return c.json(todos, 200);
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
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
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
  }
});

app.put("/todo/:id", vValidator("json", Schema), async (c) => {
  const { id } = c.req.param();
  const { title, completed } = c.req.valid("json");
  const todoId = Number(id);
  const validation = validateParam(id);
  if (!validation.success) {
    return c.json(
      {
        success: false,
        message: validation.message,
      },
      400
    );
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
      return c.json(
        {
          success: false,
          message: "Todo not found",
        },
        404
      );
    }
    return c.json(
      {
        success: true,
        id: todoId,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
  }
});

app.delete("/todo/:id", async (c) => {
  const { id } = c.req.param();
  const todoId = Number(id);
  if (!validateParam(id).success) {
    return c.json(
      {
        success: false,
        message: "Invalid ID",
      },
      400
    );
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
      return c.json(
        {
          success: false,
          message: "Todo not found",
        },
        404
      );
    }
    return c.json(
      {
        success: true,
        id: todoId,
      },
      200
    );
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      500
    );
  }
});

app.onError((err, c) => {
  console.error("Error:", err);
  return c.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    500
  );
});

console.log("Server is listening on port 8000");

serve({
  fetch: app.fetch,
  port: 8000,
});
