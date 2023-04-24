import useSWR, { mutate } from "swr";
import { NewTodo, Todo } from "../../../types/";

export const API_ENDPOINT = "http://localhost:3001";

export const fetcher = async (path: string) => {
  try {
    const res = await fetch(API_ENDPOINT + path);
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const useTodoList = () => useSWR<Todo[]>("/todo-list", fetcher);

export const useGetTodo = () => useSWR<Todo>("/todo-list/:id", fetcher);

export const createTodo = async (newTodo: NewTodo): Promise<Todo> => {
  const response = await fetch(`${API_ENDPOINT}/todo-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  const data = await response.json();
  return data;
};

export const useUpdateTodoList = () => {
  const UPDATE_PATH = "/todo-list/:id/update";
  const { data, error } = useSWR(API_ENDPOINT + UPDATE_PATH);

  const updateTodoList = async (updatedTodoId: string) => {
    await fetch(API_ENDPOINT + UPDATE_PATH, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedTodoId }),
    });

    mutate(API_ENDPOINT + UPDATE_PATH);
  };

  return { data, error, updateTodoList };
};
