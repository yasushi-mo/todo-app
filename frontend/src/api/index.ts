import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { NewTodo, Todo } from "../../../types/";

export const API_ENDPOINT = "http://localhost:3001";

// ===GET===
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

// ===POST===
export const usePostTodo = async (newTodo: NewTodo): Promise<Todo> => {
  const response = await fetch(`${API_ENDPOINT}/todo-list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo),
  });
  const data = await response.json();
  return data;
};

// ===PUT===
export const useUpdateTodoList = () => {
  const updateTodoList = async (updatedTodoId: number) => {
    const UPDATE_PATH = `/todo-list/${updatedTodoId}/update`;

    await fetch(API_ENDPOINT + UPDATE_PATH, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedTodoId }),
    });

    mutate(API_ENDPOINT + UPDATE_PATH);
  };

  return { updateTodoList };
};

// ===DELETE===
const deleteFetcher = async (url: string, { arg }: { arg: number }) => {
  const response = await fetch(`${API_ENDPOINT}${url}/${arg}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("ToDo Not Found");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return void for 204 No Content response
  return;
};

export const useDeleteTodo = () => useSWRMutation("/todo-list", deleteFetcher);
