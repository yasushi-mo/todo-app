import { ChangeEvent, FC, FormEvent } from "react";
import { usePostTodo, useTodoList, useUpdateTodoList } from "../api";

export const TodoList: FC = () => {
  const { data: todoList, error, isLoading, mutate } = useTodoList();
  const { updateTodoList } = useUpdateTodoList();

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const todoInputElement = formElement.elements.namedItem("todo");

    if (!(todoInputElement instanceof HTMLInputElement)) {
      alert(
        "Input element with name 'todo' not found or is not an HTMLInputElement."
      );
      return;
    }

    await usePostTodo({ title: todoInputElement.value });
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
      <form method="post" onSubmit={onCreate}>
        <label style={{ marginRight: 8 }}>
          ToDo 追加
          <br />
          <input name="todo" />
        </label>
        <button type="submit">追加する</button>
      </form>
    </div>
  );
};
