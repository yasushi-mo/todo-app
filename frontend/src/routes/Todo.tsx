import { FC } from "react";
import { useGetTodo } from "../api";

export const Todo: FC = () => {
  const { data: todo, error, isLoading } = useGetTodo();

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return <div>{todo?.title}</div>;
};
