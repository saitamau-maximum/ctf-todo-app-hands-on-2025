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
  checkbox.dataset.id = todo.id;
  checkbox.checked = todo.completed;

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.dataset.id = todo.id;
  textInput.value = todo.title;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.dataset.id = todo.id;

  li.appendChild(checkbox);
  li.appendChild(textInput);
  li.appendChild(deleteButton);
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

const displayError = (error) => {
  console.error("Error:", error);
  const errorMessage = document.getElementById("error-message");
  const container = document.getElementById("container");

  errorMessage.textContent = `Error: ${error.message}`;
  container.appendChild(errorMessage);
};

const clearError = () => {
  const errorMessage = document.getElementById("error-message");
  if (errorMessage) {
    errorMessage.textContent = "";
  }
};

const renderTodos = async (todos) => {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = "";
  clearError();
  try {
    todos.forEach((todo) => {
      const todoElement = createTodoElement(todo);
      todoList.appendChild(todoElement);
    });
  } catch (error) {
    displayError(error);
  }
};

(async () => {
  let todos = [];
  todos = await apiRequest("/todo");
  await renderTodos(todos);

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const ul = document.getElementById("todo-list");

  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    validateTodoInput(todoInput.value);
    const newTodo = {
      title: todoInput.value,
      completed: false,
    };

    try {
      await apiRequest("/todo", "POST", newTodo);
      todoInput.value = "";

      todos = await apiRequest("/todo");
      validateTodos(todos);
      await renderTodos(todos);
    } catch (error) {
      displayError(error);
    }
  });

  // 要素ごとにやるやりかたがわからないため親要素にeventListenerを付与
  // delete
  let isDeleting = false;
  ul.addEventListener("click", async (e) => {
    if (isDeleting) return;
    if (e.target.tagName === "BUTTON") {
      isDeleting = true;
      const todoId = e.target.dataset.id;
      try {
        await apiRequest(`/todo/${todoId}`, "DELETE");
        todos = await apiRequest("/todo");
        validateTodos(todos);
        await renderTodos(todos);
      } catch (error) {
        displayError(error);
      } finally {
        isDeleting = false;
      }
    }
  });

  const updateTodo = async (todo, todoId) => {
    try {
      await apiRequest(`/todo/${todoId}`, "PUT", todo);
      todos = await apiRequest("/todo");
      validateTodos(todos);
      await renderTodos(todos);
      clearError();
    } catch (error) {
      displayError(error);
    }
  };

  // Enterで編集を確定
  ul.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    if (e.target.tagName !== "INPUT" || e.target.type !== "text") {
      return;
    }
    if (!isValidTodoInput(e.target.value)) {
      displayError("Invalid input");
      console.log(todos);
      renderTodos(todos);
      return;
    }
    e.preventDefault();
    const todoId = e.target.dataset.id;
    const updatedTodo = {
      title: e.target.value,
      completed: todos.find((todo) => todo.id === Number.parseInt(todoId))
        .completed,
    };
    updateTodo(updatedTodo, todoId);
  });

  // blurで編集を確定
  ul.addEventListener(
    "blur",
    async (e) => {
      if (e.target.tagName !== "INPUT" || e.target.type !== "text") {
        return;
      }
      if (!isValidTodoInput(e.target.value)) {
        displayError("Invalid input");
        renderTodos(todos);
        return;
      }
      e.preventDefault();
      const todoId = e.target.dataset.id;
      const updatedTodo = {
        title: e.target.value,
        completed: todos.find((todo) => todo.id === Number.parseInt(todoId))
          .completed,
      };
      updateTodo(updatedTodo, todoId);
    },
    true
  );

  // change checkbox
  ul.addEventListener("change", async (e) => {
    if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
      if (!e.target.dataset.id) return;
      const todoId = e.target.dataset.id;
      const updatedTodo = {
        title: todos.find((todo) => todo.id === Number.parseInt(todoId)).title,
        completed: e.target.checked,
      };
      updateTodo(updatedTodo, todoId);
    }
  });
})();
