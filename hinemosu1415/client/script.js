async function loadTodos() {
  try {
    const res = await fetch('http://localhost:8000/todo')
    const todos = await res.json()

    const isValid = Array.isArray(todos) &&
      todos.every(todo =>
        typeof todo.id === 'number' &&
        typeof todo.title === 'string' &&
        typeof todo.completed === 'boolean'
      )

    if (!isValid) {
      throw new Error('JSONの形式が正しくありません')
    }

    const list = document.getElementById('todo-list')
    list.innerHTML = ''

    todos.forEach(todo => {
      const li = document.createElement('li')

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = todo.completed
      checkbox.disabled = true

      const label = document.createElement('span')
      label.textContent = ` ${todo.title}`

      li.appendChild(checkbox)
      li.appendChild(label)

      list.appendChild(li)
    })
  } catch (err) {
    console.error('データ取得に失敗しました:', err)
  }
}

  function setupAddButton() {
    const input = document.querySelector('#todo-input')
    const form = document.querySelector('#todo-form')
  
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const title = input.value.trim()
      if (!title) return
  
      postTodo({ title })
        .then(() => {
          input.value = ''
          loadTodos()
        })
        .catch(err => {
          console.error('送信に失敗しました:', err)
        })
    })
  }
  

async function postTodo(data) {
  const res = await fetch('http://localhost:8000/todo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error('POST失敗')
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setupAddButton()
  loadTodos()
})