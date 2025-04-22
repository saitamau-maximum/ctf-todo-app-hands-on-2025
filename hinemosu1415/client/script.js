window.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('http://localhost:8000/todo')
      const todos = await res.json()
  
      const list = document.getElementById('todo-list')
      todos.forEach(todo => {
        const li = document.createElement('p')
  
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = todo.completed
  
        const label = document.createElement('span')
        label.textContent = ` ${todo.title}`
  
        li.appendChild(checkbox)
        li.appendChild(label)
  
        list.appendChild(li)
      })
    } catch (err) {
      console.error('データ取得に失敗しました:', err)
    }
  })
  