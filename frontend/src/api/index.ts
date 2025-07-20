import useSWR from "swr";
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

/**
 * Generic mutation fetcher for POST, PUT, DELETE
 * - 'U' is the type of the argument (the request body/payload, or undefined for no body)
 **/
export const mutationFetcher = async <T, U>(
  url: string,
  { arg, method }: { arg: U; method: MutationHttpMethod }
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (arg) {
    console.log("arg:", arg, "\nJSON.stringify(arg):", JSON.stringify(arg));
    options.body = JSON.stringify(arg);
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
/** 新規ToDo作成 */
export const usePostTodo = () =>
  useSWRMutation<Todo, Error, string, NewTodo>("/todo-list", (url, { arg }) =>
    mutationFetcher(url, { arg, method: "POST" })
  );

// ===PUT===
/** ToDoステータス変更 */
export const useUpdateTodoStatus = () =>
  useSWRMutation<Todo, Error, string, number>(
    "/todo-list",
    (url, { arg: todoId }) =>
      mutationFetcher<Todo, undefined>(`${url}/${todoId}/update`, {
        arg: undefined, // Still no body needed for this PUT request
        method: "PUT",
      })
  );

// ===DELETE===
export const useDeleteTodo = () =>
  useSWRMutation<void, Error, string, number>(
    "/todo-list",
    (url, { arg: todoId }) =>
      mutationFetcher<void, undefined>(`${url}/${todoId}`, {
        arg: undefined,
        method: "DELETE", // Still no body needed for this DELETE request
      })
  );
