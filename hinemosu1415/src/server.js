import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { vValidator } from '@hono/valibot-validator'
import { object, string, boolean } from 'valibot'

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

  const maxId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) : 0

  const newTodo = {
    id: maxId + 1,
    title: data.title,
    completed: data.completed
  }

  todos.push(newTodo)

  return c.json({ success: true, id: newTodo.id })
})

app.get('/todo', (c) => c.json(todos))

app.put('/todo/:id', vValidator('json', TodoInputSchema), async (c) => {
  const idParam = c.req.param('id')
  if(!isInteger(idParam)) {
    return c.json({ success: false, error: 'IDを数字にしてください' }, 400)
  }

  const id = Number(idParam)
  const data = c.req.valid('json')

  const index = todos.findIndex(t => t.id === id)
  if (index === -1) {
    return c.notFound()
  }

  todos[index] = { id, ...data }
  return c.json({ success: true, id: id })
})

app.delete('/todo/:id', (c) => {
  const idParam = c.req.param('id')
  if(!isInteger(idParam)) {
    return c.json({ success: false, error: 'IDを数字にしてください' }, 400)
  }

  const id = Number(idParam)
  const index = todos.findIndex(t => t.id === id)

  if (index === -1) {
    return c.json({ success: false, error: 'Todo not found or already deleted.' }, 410)
  }

  todos.splice(index, 1)
  return c.json({ success: true , id: id})
})

async function isInteger(idParam) {
  return /^\d+$/.test(idParam) 
}

const port = 8000
serve({
  fetch: app.fetch,
  port
})