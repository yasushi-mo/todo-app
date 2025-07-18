import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import { NewTodo, Todo } from "../../../types/";

export const API_ENDPOINT = "http://localhost:3001";

// --- Utility Fetchers ---

/** Generic GET fetcher */
export const getFetcher = async <T>(path: string): Promise<T> => {
  try {
    const response = await fetch(`${API_ENDPOINT}${path}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

type MutationHttpMethod = "POST" | "PUT" | "DELETE";

/** Generic mutation fetcher for POST, PUT, DELETE */
export const mutationFetcher = async <T, U>(
  url: string,
  { argument, method }: { argument: U; method: MutationHttpMethod }
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (argument) {
    options.body = JSON.stringify(argument);
  }

  const response = await fetch(`${API_ENDPOINT}${url}`, options);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Resource Not Found");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Handle 204 No Content for DELETE or other operations that might not return a body
  if (response.status === 204) {
    return null as T; // Return null or undefined for no content
  }

  return response.json();
};

// --- SWR Hooks for Data Fetching (GET) ---

export const useTodoList = () => useSWR<Todo[]>("/todo-list", getFetcher);

export const useGetTodo = () => useSWR<Todo>("/todo-list/:id", getFetcher);

// --- SWR Hooks for Data Mutations (POST, PUT, DELETE) ---

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
