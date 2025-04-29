document.addEventListener("DOMContentLoaded", async () => {
  const todoListElement = document.getElementById("todo-list");

  // サーバーからTODOリストを取得
  const response = await fetch("http://localhost:8000/todo");
  const todoList = await response.json();

  // TODOリストを表示
  todoList.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.disabled = true; // チェックボックスは操作不可

    const title = document.createElement("span");
    title.textContent = todo.title;

    todoItem.appendChild(checkbox);
    todoItem.appendChild(title);
    todoListElement.appendChild(todoItem);
  });
});
  