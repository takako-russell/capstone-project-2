import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddStoreForm from "./AddStoreForm";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    createStore: vi
      .fn()
      .mockResolvedValue({
        id: 1,
        storeName: "Test Store",
        location: "Test Location",
      }),
  },
}));

describe("AddStoreForm", () => {
  const mockAddStore = vi.fn();
  const mockCloseModal = vi.fn();
  const mockUser = { id: "user1" };

  it("renders form fields", () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <AddStoreForm addStore={mockAddStore} closeModal={mockCloseModal} />
      </UserContext.Provider>
    );

    expect(screen.getByLabelText("Store Name")).toBeTruthy();
    expect(screen.getByLabelText("Location")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add" })).toBeTruthy();
  });

  it("submits form with entered data", async () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <AddStoreForm addStore={mockAddStore} closeModal={mockCloseModal} />
      </UserContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Store Name"), {
      target: { value: "Test Store" },
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Test Location" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    // Wait for the next tick of the event loop
    await vi.waitFor(() => {
      expect(mockAddStore).toHaveBeenCalledWith({
        id: 1,
        storeName: "Test Store",
        location: "Test Location",
      });
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});
