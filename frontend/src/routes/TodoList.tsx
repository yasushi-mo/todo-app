import { ChangeEvent, FC } from "react";
import { createTodo, useTodoList, useUpdateTodoList } from "../api";

export const TodoList: FC = () => {
  const { data: todoList, error, isLoading } = useTodoList();
  const { updateTodoList } = useUpdateTodoList();

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await updateTodoList(event.currentTarget.id);
  };

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div>
      <h1>ToDoリスト</h1>
      <ul>
        {todoList?.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              id={String(todo.id)}
              value={todo.title}
              checked={todo.completed}
              onChange={onChange}
            />
            <label htmlFor={String(todo.id)}>{todo.title}</label>
          </li>
        ))}
      </ul>
      <button onClick={() => createTodo({ title: "Learn Express" })}>
        Create
      </button>
    </div>
  );
};
