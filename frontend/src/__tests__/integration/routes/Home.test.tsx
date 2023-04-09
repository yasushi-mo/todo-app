import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Home } from "../../../routes/Home";
import { DUMMY_TODO_LIST } from "../../libs/dummyData";

describe("Home Page test", () => {
  test("Render Home", async () => {
    render(<Home />);

    await waitFor(() => {
      screen.getByRole("heading", { name: "ToDoリスト" });

      const todoList = screen.getAllByRole("listitem");
      expect(todoList).toHaveLength(DUMMY_TODO_LIST.length);
      todoList.forEach((todo, index) => {
        const DUMMY_TODO = DUMMY_TODO_LIST[index];
        expect(todo).toHaveTextContent(DUMMY_TODO.title);
      });
      screen.debug();
    });
  });
});
