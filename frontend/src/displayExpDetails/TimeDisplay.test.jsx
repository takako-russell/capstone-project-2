import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MonthlyDisplay from "./MonthlyDisplay";
import WeeklyDisplay from "./WeeklyDisplay";
import YearlyDisplay from "./YearlyDisplay";

// Mock the Ant Design Table component
vi.mock("antd", () => ({
  Table: ({ columns, dataSource }) => (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.dataIndex]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

const components = [
  {
    name: "MonthlyDisplay",
    Component: MonthlyDisplay,
    mockData: [
      { month: "January", sum: 100 },
      { month: "February", sum: 200 },
    ],
    timeColumn: "Month",
  },
  {
    name: "WeeklyDisplay",
    Component: WeeklyDisplay,
    mockData: [
      { start_date: "2023-01-01", sum: 50 },
      { start_date: "2023-01-08", sum: 75 },
    ],
    timeColumn: "Week",
  },
  {
    name: "YearlyDisplay",
    Component: YearlyDisplay,
    mockData: [
      { year: "2022", amount: 1000 },
      { year: "2023", amount: 1500 },
    ],
    timeColumn: "Year",
  },
];

describe("Display Components", () => {
  components.forEach(({ name, Component, mockData, timeColumn }) => {
    describe(name, () => {
      it("renders the table with correct columns", () => {
        render(<Component expenseData={mockData} />);

        expect(screen.getByText(timeColumn)).toBeTruthy();
        expect(screen.getByText("Expense")).toBeTruthy();
      });

      it("displays the data correctly", () => {
        render(<Component expenseData={mockData} />);

        mockData.forEach((row) => {
          Object.values(row).forEach((value) => {
            expect(screen.getByText(value.toString())).toBeTruthy();
          });
        });
      });
    });
  });
});
