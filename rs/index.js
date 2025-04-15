import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello, Hono.js!', 200);
});

app.fire();