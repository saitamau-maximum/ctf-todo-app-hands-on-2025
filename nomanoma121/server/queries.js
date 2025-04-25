export const Todo = {
  createTable: `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL
    )
  `,
  insert: `
    INSERT INTO todos (title, completed)
    VALUES (?, ?)
  `,
  selectAll: `
    SELECT * FROM todos
  `,
  update: `
    UPDATE todos
    SET title = ?, completed = ?
    WHERE id = ?
  `,
  delete: `
    DELETE FROM todos
    WHERE id = ?
  `,
};
