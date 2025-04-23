const todoList = document.getElementById("todo-list");

const fetchTodos = async () => {
  const response = await fetch("http://localhost:8000/todo");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const todos = await response.json();
  return todos;
};

const createTodoElement = (todo) => {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = todo.title;

  li.appendChild(checkbox);
  li.appendChild(textInput);
  return li;
};

(async () => {
  const todos = await fetchTodos();
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
})();
