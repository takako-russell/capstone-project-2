import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AddItemForm from "./AddItemForm";
import ShoppingApi from "../api/api";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getCategories: vi.fn(),
    addItem: vi.fn(),
  },
}));

// Mock the CategoryModal component
vi.mock("../category/CategoryModal", () => ({
  default: ({ isOpen, onClose }) =>
    isOpen ? <div data-testid="category-modal">Category Modal</div> : null,
}));

describe("AddItemForm Component", () => {
  const mockAddItemToState = vi.fn();
  const mockStoreId = "1";
  const mockUser = { id: "user1" };

  beforeEach(() => {
    vi.resetAllMocks();
    ShoppingApi.getCategories.mockResolvedValue([
      { id: 1, category: "Category 1" },
      { id: 2, category: "Category 2" },
    ]);
  });

  const renderComponent = async () => {
    let rendered;
    await act(async () => {
      rendered = render(
        <UserContext.Provider value={{ dbUser: mockUser }}>
          <AddItemForm
            storeId={mockStoreId}
            addItemToState={mockAddItemToState}
          />
        </UserContext.Provider>
      );
    });
    return rendered;
  };

  it("renders the form correctly", async () => {
    await renderComponent();

    expect(screen.getByLabelText("Item")).toBeTruthy();
    expect(screen.getByLabelText(/brand/i)).toBeTruthy();
    expect(screen.getByLabelText(/quantity/i)).toBeTruthy();
    expect(screen.getByLabelText(/purpose/i)).toBeTruthy();
    expect(screen.getByLabelText(/price/i)).toBeTruthy();
    expect(screen.getByLabelText(/category/i)).toBeTruthy();
  });

  it("submits the form with correct data", async () => {
    ShoppingApi.addItem.mockResolvedValue({
      id: "newItem1",
      itemName: "Test Item",
    });
    await renderComponent();

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Item"), {
        target: { value: "Test Item" },
      });
      fireEvent.change(screen.getByLabelText(/brand/i), {
        target: { value: "Test Brand" },
      });
      fireEvent.change(screen.getByLabelText(/quantity/i), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: "1" },
      });

      fireEvent.click(screen.getByText("Add"));
    });

    await waitFor(() => {
      expect(ShoppingApi.addItem).toHaveBeenCalledWith(
        mockUser.id,
        mockStoreId,
        expect.objectContaining({
          itemName: "Test Item",
          brand: "Test Brand",
          quantity: 2,
          category: 1,
        })
      );
      expect(mockAddItemToState).toHaveBeenCalledWith({
        id: "newItem1",
        itemName: "Test Item",
      });
    });
  });

  // Add more tests as needed
});
