import express, { Express, Request, Response } from "express";
import { Todo } from "../types";
import cors from "cors";

const app: Express = express();
const port = 3001;

app.use(cors());

const sampleData = [
  { id: 1, title: "牛乳を買う", completed: false },
  { id: 2, title: "洗濯をする", completed: true },
  { id: 3, title: "請求書を支払う", completed: false },
];

let todoList: Todo[] = sampleData;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/todo-list", (req: Request, res: Response) => {
  res.json(todoList);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
