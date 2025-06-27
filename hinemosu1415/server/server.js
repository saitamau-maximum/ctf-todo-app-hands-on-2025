import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { vValidator } from '@hono/valibot-validator'
import { object, string, boolean } from 'valibot'
import pkg from 'pg'

const { Pool } = pkg

const app = new Hono()
app.use('*', cors())

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT)
})

const TodoInputSchema = object({
  title: string(),
  completed: boolean()
})

app.get('/todo', async (c) => {
  const result = await pool.query('SELECT * FROM todos')
  return c.json(result.rows)
})

app.post('/todo', vValidator('json', TodoInputSchema), async (c) => {
  const data = c.req.valid('json')
  const result = await pool.query(
    'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING id',
    [data.title, data.completed]
  )
  return c.json({ success: true, id: result.rows[0].id })
})

app.put('/todo/:id', vValidator('json', TodoInputSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) {
    return c.json({ success: false, error: 'IDは整数で' }, 400)
  }
  const data = c.req.valid('json')
  const result = await pool.query(
    'UPDATE todos SET title = $1, completed = $2 WHERE id = $3',
    [data.title, data.completed, id]
  )
  return result.rowCount
    ? c.json({ success: true, id })
    : c.notFound()
})

app.delete('/todo/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (!Number.isInteger(id)) {
    return c.json({ success: false, error: 'IDは整数で' }, 400)
  }
  const result = await pool.query('DELETE FROM todos WHERE id = $1', [id])
  return result.rowCount
    ? c.json({ success: true, id })
    : c.json({ success: false, error: '該当なし' }, 404)
})

async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL
      )
    `)

    serve({ fetch: app.fetch, port: 8000 })
    console.log('Server started on http://localhost:8000')
  } catch (err) {
    console.error('起動失敗:', err)
    process.exit(1)
  }
}

main()
