import { ChangeEvent, FC } from "react";
import { usePostTodo, useTodoList, useUpdateTodoList } from "../api";

export const TodoList: FC = () => {
  const { data: todoList, error, isLoading, mutate } = useTodoList();
  const { updateTodoList } = useUpdateTodoList();

  const onCreate = async () => {
    await usePostTodo({ title: "Learn Express!" });
    await mutate();
  };

  const onToggle = async (event: ChangeEvent<HTMLInputElement>) => {
    await updateTodoList(Number(event.currentTarget.id));
    await mutate();
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
              onChange={onToggle}
            />
            <label htmlFor={String(todo.id)}>{todo.title}</label>
          </li>
        ))}
      </ul>
      <button onClick={onCreate}>Create</button>
    </div>
  );
};
