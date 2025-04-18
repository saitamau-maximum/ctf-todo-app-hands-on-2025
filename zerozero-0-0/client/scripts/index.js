// Get todos

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
    fetchTodos();
})

// post todos

const addTodoButton = document.getElementById("add-todo-button");
const addTodoInput = document.getElementById("add-todo-input");

async function addTodo() {
    const title = addTodoInput.value;
    if (!title) {
        return;
    }

    const res = await fetch("http://localhost:8000/todo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
    });

    if (!res.ok) {
        throw new Error("Network response was not ok");
    }

    addTodoInput.value = "";
    fetchTodos();
}

addTodoButton.addEventListener("click", () => {
    addTodo()
});
