import { render, screen } from "@testing-library/react";
import Button from "../src/frontend/components";

test("renders Add Task button", () => {
  render(<Button label="Add Task" />);
  expect(screen.getByRole("button")).toHaveTextContent("Add Task");
});