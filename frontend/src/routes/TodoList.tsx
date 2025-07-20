import { ChangeEvent, FC, FormEvent } from "react";
import {
  useDeleteTodo,
  usePostTodo,
  useTodoList,
  useUpdateTodoStatus,
} from "../api";

export const TodoList: FC = () => {
  const { data: todoList, error, isLoading, mutate } = useTodoList();
  const { trigger: triggerCreate } = usePostTodo();
  const { trigger: triggerUpdateStatus } = useUpdateTodoStatus();
  const { trigger: triggerDelete } = useDeleteTodo();

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

    await triggerCreate({ title: todoInputElement.value });
    await mutate();
  };

  const onUpdateStatus = async (event: ChangeEvent<HTMLInputElement>) => {
    await triggerUpdateStatus(Number(event.currentTarget.id));
    await mutate();
  };

  const onDelete = async (id: number) => {
    await triggerDelete(id);
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
              onChange={onUpdateStatus}
            />
            <label htmlFor={String(todo.id)}>{todo.title}</label>
            <button onClick={() => onDelete(todo.id)} style={{ marginLeft: 8 }}>
              削除
            </button>
          </li>
        ))}
      </ul>
      <form method="post" onSubmit={onCreate}>
        <label>
          ToDo 追加
          <br />
          <input name="todo" />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>
          追加
        </button>
      </form>
    </div>
  );
};
