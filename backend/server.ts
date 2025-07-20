import express, { Express, Request, Response } from "express";
import { Todo } from "../types";
import cors from "cors";

const app: Express = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const sampleData = [
  { id: 1, title: "牛乳を買う", completed: false },
  { id: 2, title: "洗濯をする", completed: true },
  { id: 3, title: "請求書を支払う", completed: false },
];

let todoList: Todo[] = sampleData;

// ===GET===
// Get all todo
app.get("/todo-list", (req: Request, res: Response) => {
  res.json(todoList);
});

// Get a todo by id
app.get("/todo-list/:id", (req: Request, res: Response) => {
  const todoId = Number(req.params.id);
  const todo = todoList.find((todo) => todo.id === todoId);

  if (!todo) {
    res.status(404).json({ error: "Not Found" });
  } else {
    res.json(todo);
  }
});

// ===POST===
// Create a new todo
app.post("/todo-list", (req: Request, res: Response) => {
  const newTodoTitle = req.body.title;
  console.log("🚀 ~ file: server.ts:42 ~ app.post ~ req.body:", req.body);
  const newTodo: Todo = {
    id: Date.now(),
    title: newTodoTitle,
    completed: false,
  };
  todoList.push(newTodo);

  res.status(201).json(newTodo);
});

// ===PUT===
// Update a todo status
app.put("/todo-list/:id/update", (req: Request, res: Response) => {
  const updatedTodoId = Number(req.params.id);
  console.log("🚀 ~ app.put ~ updatedTodoId:", updatedTodoId);
  const updatedTodo = todoList.find((todo) => todo.id === updatedTodoId);

  if (!updatedTodo) {
    res.status(404).json({ error: "ToDo Not Found" });
    return;
  }

  /** Create the updated todo item (toggling 'completed') */
  const updatedTodoItem = {
    ...updatedTodo,
    completed: !updatedTodo.completed,
  };

  // Update the todoList in place or create a new array
  todoList = todoList.map((todo) =>
    todo.id === updatedTodoId ? updatedTodoItem : todo
  );

  // NOW, send ONLY the updatedTodoItem back
  res.json(updatedTodoItem);
});

// ===DELETE===
// Delete a todo
app.delete("/todo-list/:id", (req: Request, res: Response) => {
  const todoId = Number(req.params.id);
  const todoIndex = todoList.findIndex((todo) => todo.id === todoId);
  console.log("🚀 ~ app.delete ~ todoId:", todoId, " ~ todoIndex:", todoIndex);

  if (todoIndex === -1) {
    res.status(404).json({ error: "ToDo Not Found" });
  } else {
    todoList.splice(todoIndex, 1);
    res.sendStatus(204);
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
