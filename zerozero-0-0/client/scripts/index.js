const todoListElement = document.getElementById("todo-list");

async function fetchTodos() {
    const res = await fetch("http://localhost:8000/todo");
    if (!res.ok) {
        throw new Error("Network response was not ok");
    }
    const todos = await res.json();

    todoListElement.innerHTML = "";

    todos.forEach((todo) => {
        const listItem = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.disabled = true;

        const span = document.createElement("span");
        span.textContent = todo.title;

        listItem.appendChild(checkbox);
        listItem.appendChild(span);

        if (todo.completed) {
            listItem.classList.add("completed");
        }
        todoListElement.appendChild(listItem);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTodos()
        .then(todos => {
            renderTodos(todos);
        })
})