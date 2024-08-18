import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddCategoryForm from "./AddCategoryForm";
import UserContext from "../UserContext";

describe("AddCategoryForm", () => {
  const mockAddCategoryToState = vi.fn();
  const mockCloseModal = vi.fn();
  const mockUser = { id: "user1" };

  it("renders form elements", () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <AddCategoryForm
          addCategoryToState={mockAddCategoryToState}
          closeModal={mockCloseModal}
        />
      </UserContext.Provider>
    );

    expect(screen.getByLabelText("Category Name")).toBeTruthy();
    expect(screen.getByPlaceholderText("Category Name")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add" })).toBeTruthy();
  });

  it("updates input value on change", () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <AddCategoryForm
          addCategoryToState={mockAddCategoryToState}
          closeModal={mockCloseModal}
        />
      </UserContext.Provider>
    );

    const input = screen.getByLabelText("Category Name");
    fireEvent.change(input, { target: { value: "New Category" } });
    expect(input.value).toBe("New Category");
  });
});
