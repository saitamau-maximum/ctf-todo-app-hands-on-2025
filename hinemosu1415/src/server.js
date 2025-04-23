import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { vValidator } from '@hono/valibot-validator'
import { object, string, number, boolean } from 'valibot'

const app = new Hono()

app.use('*', cors())

const todos = [
    { id: 1, title: "JavaScriptを勉強する", completed: false }, 
    { id: 2, title: "CTFのWriteupを書く", completed: false }, 
    { id: 3, title: "学校の課題を提出する", completed: true }
];

const todoInputSchema = object({
  title: string()
})

app.post('/todo', vValidator('json', todoInputSchema), async (c) => {
  const data = c.req.valid('json')

  const newTodo = {
    id: todos.length + 1,
    title: data.title,
    completed: false
  }

  todos.push(newTodo)

  return c.json(newTodo)
})

app.get('/todo', (c) => c.json(todos))

const port = 8000
serve({
  fetch: app.fetch,
  port
})
