const apiRequest = async (path, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`http://localhost:8000${path}`, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
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

const validateTodo = (todo) => {
  if (typeof todo.title !== "string" || todo.title.length === 0) {
    throw new Error("Title must be a non-empty string");
  }
  if (typeof todo.completed !== "boolean") {
    throw new Error("Completed must be a boolean");
  }
  if (typeof todo.id !== "number" || todo.id <= 0) {
    throw new Error("ID must be a positive number");
  }
};

const validateTodos = (todos) => {
  if (!Array.isArray(todos)) {
    throw new Error("Todos must be an array");
  }
  todos.forEach((todo) => {
    validateTodo(todo);
  });
};

const validateTodoInput = (input) => {
  if (typeof input !== "string" || input.length === 0) {
    throw new Error("Input must be a non-empty string");
  }
};

const renderTodos = async () => {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  const todos = await apiRequest("/todo");

  validateTodos(todos);

  todos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
};

(async () => {
  await renderTodos();

  const addButton = document.getElementById("add-button");
  const todoInput = document.getElementById("todo-input");

  addButton.addEventListener("click", async () => {
    validateTodoInput(todoInput.value);
    const newTodo = {
      title: todoInput.value,
      completed: false,
    };

    try {
      await apiRequest("/todo", "POST", newTodo);
      todoInput.value = "";

      const todos = await apiRequest("/todo");
      validateTodos(todos);
      await renderTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  });
})();
