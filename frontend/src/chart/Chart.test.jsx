import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Chart from "./Chart";
import UserContext from "../UserContext";
import ShoppingApi from "../api/api";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getAllExpenses: vi.fn(),
  },
}));

// Mock MUI components
vi.mock("@mui/x-charts", () => ({
  LineChart: ({ dataset }) => (
    <div data-testid="line-chart">
      Mocked Line Chart
      <pre>{JSON.stringify(dataset, null, 2)}</pre>
    </div>
  ),
  axisClasses: {},
}));

vi.mock("@mui/material/styles", () => ({
  useTheme: () => ({
    typography: { body1: {}, body2: {} },
    palette: { text: { primary: "", secondary: "" }, primary: { light: "" } },
  }),
}));

describe("Chart Component", () => {
  const mockUser = { id: "user1" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <Chart />
      </UserContext.Provider>
    );
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("shows no data message when no expenses are available", async () => {
    ShoppingApi.getAllExpenses.mockResolvedValue([]);

    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <Chart />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("No expenses data available")).toBeTruthy();
    });
  });

  it("shows error message when API call fails", async () => {
    ShoppingApi.getAllExpenses.mockRejectedValue(new Error("API Error"));

    render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <Chart />
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeTruthy();
    });
  });
});
