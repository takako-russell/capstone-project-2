import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import RoutesConfig from "./RoutesConfig";

// Mock the components that RoutesConfig renders
vi.mock("../store/StoreList", () => ({
  default: () => <div>StoreList</div>,
}));
vi.mock("../item/ItemList", () => ({
  default: () => <div>ItemList</div>,
}));
vi.mock("../displayExpDetails/ExpenseDetails", () => ({
  default: () => <div>ExpenseDetails</div>,
}));

// Mock props
const mockProps = {
  stores: [],
  searchStores: vi.fn(),
  removeStore: vi.fn(),
  addStore: vi.fn(),
  setExpense: vi.fn(),
};

describe("RoutesConfig", () => {
  it("renders StoreList for root path", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <RoutesConfig {...mockProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("StoreList")).toBeTruthy();
  });
  it("renders ItemList for /:storeId/items path", () => {
    render(
      <MemoryRouter initialEntries={["/1/items"]}>
        <RoutesConfig {...mockProps} />
      </MemoryRouter>
    );
    expect(screen.getByText("ItemList")).toBeTruthy();
  });
});
