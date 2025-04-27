import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'

const app = new Hono()

app.use('*', cors())

const db = new Database('todos.db')

db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL
  )
`).run()


const TodoInputSchema = object({
  title: string(),
  completed: boolean()
})

app.post('/todo', vValidator('json', TodoInputSchema), async (c) => {
  const data = c.req.valid('json')

  const stmt = db.prepare('INSERT INTO todos (title, completed) VALUES (?, ?)')
  const info = stmt.run(data.title, data.completed ? 1 : 0)

  return c.json({ success: true, id: info.lastInsertRowid })
})

app.get('/todo', (c) => {
  const rows = db.prepare('SELECT * FROM todos').all()

  const todos = rows.map(row => ({
    id: row.id,
    title: row.title,
    completed: !!row.completed
  }))
  
  return c.json(todos)
})

app.put('/todo/:id', vValidator('json', TodoInputSchema), async (c) => {
  const idParam = c.req.param('id')
  if (!isInteger(idParam)) {
    return c.json({ success: false, error: 'IDを数字にしてください' }, 400)
  }

  const id = Number(idParam)
  const data = c.req.valid('json')

  const stmt = db.prepare('UPDATE todos SET title = ?, completed = ? WHERE id = ?')
  const result = stmt.run(data.title, data.completed ? 1 : 0, id)

  if (result.changes === 0) {
    return c.notFound()
  }

  return c.json({ success: true, id })
})

app.delete('/todo/:id', (c) => {
  const idParam = c.req.param('id')
  if (!isInteger(idParam)) {
    return c.json({ success: false, error: 'IDを数字にしてください' }, 400)
  }

  const id = Number(idParam)
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?')
  const result = stmt.run(id)

  if (result.changes === 0) {
    return c.json({ success: false, error: 'Todo not found or already deleted.' }, 410)
  }

  return c.json({ success: true, id })
})

function isInteger(idParam) {
  return /^\d+$/.test(idParam) 
}

const port = 8000
serve({
  fetch: app.fetch,
  port
})
