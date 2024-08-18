import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import EditCategoryForm from "./EditCategoryForm";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getCategories: vi.fn().mockResolvedValue([
      { id: 1, category: "Category 1", ordernumber: 1 },
      { id: 2, category: "Category 2", ordernumber: 2 },
    ]),
  },
}));

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("EditCategoryForm", () => {
  const mockOnFinish = vi.fn();
  const mockUser = { id: "user1" };

  it("renders without crashing", async () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <EditCategoryForm onFinish={mockOnFinish} />
      </UserContext.Provider>
    );

    // Wait for the component to finish rendering
    await waitFor(() => {
      expect(screen.getByText("Save Changes")).toBeTruthy();
      expect(screen.getByText("Add New Category")).toBeTruthy();
    });
  });
});
