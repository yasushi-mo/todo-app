import { rest } from "msw";
import { DUMMY_TODO_LIST } from "../dummyData";

export const handlers = [
  rest.get("http://localhost:3001/todo-list", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DUMMY_TODO_LIST));
  }),
];
