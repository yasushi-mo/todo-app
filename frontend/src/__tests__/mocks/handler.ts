import { rest } from "msw";

export const handlers = [
  rest.get("http://localhost:3001/todo-list", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
