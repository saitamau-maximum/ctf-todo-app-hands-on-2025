import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { readFile } from 'fs/promises'

const app = new Hono()

app.use('*', cors())

const todos = [
    { id: 1, title: "JavaScriptを勉強する", completed: false }, 
    { id: 2, title: "CTFのWriteupを書く", completed: false }, 
    { id: 3, title: "学校の課題を提出する", completed: true }
];

app.get('/todo', (c) => c.json(todos))

app.get('/', async (c) => {
  const html = await readFile('./client/index.html', 'utf-8')
  return c.html(html)
})

app.get('/script.js', async (c) => {
  const js = await readFile('./client/script.js', 'utf-8')
  return new Response(js, {
    headers: { 'Content-Type': 'application/javascript' }
  })
})

const port = 8000
serve({
  fetch: app.fetch,
  port
})
