import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import ExpenseDetails from "./ExpenseDetails";
import UserContext from "../UserContext";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    getExpenseSum: vi.fn().mockResolvedValue({
      weekly_sums: [],
      monthly_sums: [],
      yearly_sums: [],
      weekly_store_sums: {},
      monthly_store_sums: {},
      yearly_store_sums: {},
    }),
  },
}));

// Mock child components
vi.mock("./WeeklyDisplay", () => ({
  default: () => <div>Weekly Display</div>,
}));
vi.mock("./MonthlyDisplay", () => ({
  default: () => <div>Monthly Display</div>,
}));
vi.mock("./YearlyDisplay", () => ({
  default: () => <div>Yearly Display</div>,
}));
vi.mock("./WeeklyPieChart", () => ({
  default: () => <div>Weekly Pie Chart</div>,
}));
vi.mock("./MonthlyPieChart", () => ({
  default: () => <div>Monthly Pie Chart</div>,
}));
vi.mock("./YearlyPieChart", () => ({
  default: () => <div>Yearly Pie Chart</div>,
}));

// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("ExpenseDetails Component", () => {
  const mockUser = { id: "user1" };

  const renderComponent = () => {
    return render(
      <UserContext.Provider value={{ dbUser: mockUser }}>
        <ExpenseDetails />
      </UserContext.Provider>
    );
  };

  it("renders initial weekly view", async () => {
    renderComponent();
    expect(await screen.findByText("Weekly Display")).toBeTruthy();
    expect(await screen.findByText("Weekly Pie Chart")).toBeTruthy();
  });

  it("changes to monthly view when selected", async () => {
    renderComponent();
    fireEvent.click(await screen.findByText("Monthly"));
    expect(await screen.findByText("Monthly Display")).toBeTruthy();
    expect(await screen.findByText("Monthly Pie Chart")).toBeTruthy();
  });

  it("changes to yearly view when selected", async () => {
    renderComponent();
    fireEvent.click(await screen.findByText("Yearly"));
    expect(await screen.findByText("Yearly Display")).toBeTruthy();
    expect(await screen.findByText("Yearly Pie Chart")).toBeTruthy();
  });
});
