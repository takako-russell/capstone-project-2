import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import StoreCard from "./StoreCard";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    deleteStore: vi.fn().mockResolvedValue({}),
  },
}));

// Mock Ant Design components
vi.mock("antd", () => ({
  Card: ({ children }) => <div data-testid="mock-card">{children}</div>,
  Row: ({ children }) => <div data-testid="mock-row">{children}</div>,
  Col: ({ children }) => <div data-testid="mock-col">{children}</div>,
  Modal: {
    confirm: ({ onOk }) => onOk(),
  },
}));

// Mock Ant Design icons
vi.mock("@ant-design/icons", () => ({
  CloseCircleOutlined: () => <span data-testid="mock-close-icon" />,
}));

describe("StoreCard", () => {
  const mockStore = {
    id: 1,
    storeName: "Test Store",
    location: "Test Location",
  };
  const mockRemoveStore = vi.fn();
  const mockUser = { id: "user1" };

  it("renders store information", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ dbUser: mockUser }}>
          <StoreCard store={mockStore} removeStore={mockRemoveStore} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText("Test Store")).toBeTruthy();
    expect(screen.getByText("Test Location")).toBeTruthy();
  });

  it("calls removeStore when delete is confirmed", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ dbUser: mockUser }}>
          <StoreCard store={mockStore} removeStore={mockRemoveStore} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("mock-close-icon"));

    // Wait for the next tick of the event loop
    await vi.waitFor(() => {
      expect(mockRemoveStore).toHaveBeenCalledWith(1);
    });
  });
});
