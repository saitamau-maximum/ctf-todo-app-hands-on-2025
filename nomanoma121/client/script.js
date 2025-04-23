const validateTodo = (todo) => {
  if (typeof todo.id !== "number" || todo.id <= 0) {
    throw new Error("Invalid ID");
  }
  if (typeof todo.title !== "string" || todo.title.length === 0) {
    throw new Error("Invalid title");
  }
  if (typeof todo.completed !== "boolean") {
    throw new Error("Invalid completed status");
  }
};

const validateTodos = (todos) => {
  if (!Array.isArray(todos)) {
    throw new Error("Invalid todos format");
  }
  todos.forEach((todo) => {
    validateTodo(todo);
  });
};

const fetchTodos = async () => {
  const response = await fetch("http://localhost:8000/todo");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const todos = await response.json();

  validateTodos(todos);

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
  const todoList = document.getElementById("todo-list");
  const todos = await fetchTodos();
  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
})();
