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
    todos.forEach(todo => {
      const li = document.createElement('p')

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

window.addEventListener('DOMContentLoaded', loadTodos)