import useSWR from "swr";
import { Todo } from "../../../types/";

export const fetcher = async (path: string) => {
  try {
    const res = await fetch("http://localhost:3001" + path);
    return res.json();
  } catch (error) {
    alert(error);
  }
};

export const useTodoList = () => useSWR<Todo[]>("/todo-list", fetcher);
