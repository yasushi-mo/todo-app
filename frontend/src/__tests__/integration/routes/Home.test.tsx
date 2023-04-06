import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "../../../routes/Home";

describe("Home", () => {
  test("Home", () => {
    render(<Home />, { wrapper: BrowserRouter });
  });

  screen.debug();
});
