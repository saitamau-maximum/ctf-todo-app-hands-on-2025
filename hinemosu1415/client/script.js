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

      checkbox.addEventListener('change', async () => {
          await updateTodo(todo.id, { title: todo.title, completed: checkbox.checked })
      })

      checkbox.addEventListener('change', async () => {
          await updateTodo(todo.id, { title: todo.title, completed: checkbox.checked })
      })

      const label = document.createElement('span')
      label.textContent = ` ${todo.title}`

      const deletebox = document.createElement('input')
      deletebox.type = 'button'
      deletebox.id = 'delete-button';
      deletebox.value = '削除';

      deletebox.addEventListener('click', async () => {
        deletebox.disabled = true
        try {
          await deleteTodo(todo.id)
          loadTodos() // 再読み込み
        } catch (err) {
          deletebox.disabled = false
          console.error('削除に失敗しました:', err)
        }
      })

      const deletebox = document.createElement('input')
      deletebox.type = 'button'
      deletebox.id = 'delete-button';
      deletebox.value = '削除';

      deletebox.addEventListener('click', async () => {
        deletebox.disabled = true
        try {
          await deleteTodo(todo.id)
          loadTodos() // 再読み込み
        } catch (err) {
          deletebox.disabled = false
          console.error('削除に失敗しました:', err)
        }
      })

      li.appendChild(checkbox)
      li.appendChild(label)
      li.appendChild(deletebox)
      li.appendChild(deletebox)

      list.appendChild(li)
    })
  } catch (err) {
    console.error('データ取得に失敗しました:', err)
  }
}
  function setupAddButton() {
    const input = document.getElementById('todo-input')
    const check = document.getElementById('todo-comp')
    const form = document.getElementById('todo-form')
  
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const title = input.value.trim()
      const completed = check.checked
      if (!title) return
  
      postTodo({ title, completed })
        .then(() => {
          input.value = ''
          check.value = false
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

async function updateTodo(id, data) {
  const res = await fetch(`http://localhost:8000/todo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error('PUT失敗')
  }
}

async function deleteTodo(id) {
  const res = await fetch(`http://localhost:8000/todo/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw new Error('DELETE失敗')
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setupAddButton()
  loadTodos()
})