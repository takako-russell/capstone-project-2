import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ItemList from "./ItemList";
import ShoppingApi from "../api/api";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getItems: vi.fn(),
    getCategories: vi.fn(),
  },
}));

// Mock Ant Design components
vi.mock("antd", () => ({
  Row: ({ children }) => <div data-testid="mock-row">{children}</div>,
  Col: ({ children }) => <div data-testid="mock-col">{children}</div>,
  Space: ({ children }) => <div data-testid="mock-space">{children}</div>,
  Button: ({ children }) => <button>{children}</button>,
  Table: () => <table data-testid="mock-table" />,
  Modal: ({ children }) => <div data-testid="mock-modal">{children}</div>,
}));

// Mock the ItemModal component
vi.mock("./ItemModal", () => ({
  default: ({ isItemModalOpen }) =>
    isItemModalOpen ? (
      <div data-testid="mock-item-modal">Mock Item Modal</div>
    ) : null,
}));

describe("ItemList Component", () => {
  const mockUser = { id: "user1" };
  const mockItems = [
    { id: 1, itemName: "Item 1" },
    { id: 2, itemName: "Item 2" },
  ];

  beforeEach(() => {
    ShoppingApi.getItems.mockResolvedValue(mockItems);
    ShoppingApi.getCategories.mockResolvedValue([]);
  });

  it("renders the ItemList component", async () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <MemoryRouter>
          <ItemList />
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Check if the "Add Item" button is rendered
    expect(await screen.findByText("Add Item")).toBeTruthy();

    // Check if the table is rendered
    expect(await screen.findByTestId("mock-table")).toBeTruthy();
  });
});
