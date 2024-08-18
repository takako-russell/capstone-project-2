import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExpenseForm from "./ExpenseForm";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getStores: vi.fn().mockResolvedValue([
      { id: 1, storeName: "Store 1" },
      { id: 2, storeName: "Store 2" },
    ]),
    addExpense: vi
      .fn()
      .mockResolvedValue({
        id: 1,
        date: "2023-07-01",
        amount: 100,
        store_id: 1,
      }),
  },
}));

describe("ExpenseForm", () => {
  it("renders form elements", () => {
    render(
      <UserContext.Provider value={{ dbUser: { id: "user1" } }}>
        <ExpenseForm setExpenseToState={() => {}} closeModal={() => {}} />
      </UserContext.Provider>
    );

    expect(screen.getByText("Add Expense")).toBeTruthy();
    expect(screen.getByText("Date")).toBeTruthy();
    expect(screen.getByText("Amount")).toBeTruthy();
    expect(screen.getByText("Store")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Submit" })).toBeTruthy();
  });
});
