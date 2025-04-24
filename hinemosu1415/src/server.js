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

const TodoInputSchema = object({
  title: string(),
  completed: boolean()
})

app.post('/todo', vValidator('json', TodoInputSchema), async (c) => {
  const data = c.req.valid('json')

  const newTodo = {
    id: todos.length + 1,
    title: data.title,
    completed: data.completed
  }

  todos.push(newTodo)

  return c.json({ success: true, id: newTodo.id })
})

app.get('/todo', (c) => c.json(todos))

const port = 8000
serve({
  fetch: app.fetch,
  port
})


const initialTodos = [
  { title: "CTFのWeb問題に慣れる", completed: true }
]

initialTodos.forEach(todo => {
  fetch(`http://localhost:8000/todo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  })
    .then(res => {
      if (!res.ok) throw new Error('初期TODOの送信に失敗しました')
      return res.json()
    })
})