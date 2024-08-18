import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MonthlyPieChart from "./MonthlyPieChart";
import WeeklyPieChart from "./WeeklyPieChart";
import YearlyPieChart from "./YearlyPieChart";

// Mock the MUI PieChart component
vi.mock("@mui/x-charts", () => ({
  PieChart: ({ series }) => (
    <div data-testid="pie-chart">{JSON.stringify(series)}</div>
  ),
}));

const components = [
  { name: "MonthlyPieChart", Component: MonthlyPieChart },
  { name: "WeeklyPieChart", Component: WeeklyPieChart },
  { name: "YearlyPieChart", Component: YearlyPieChart },
];

describe("PieChart Components", () => {
  components.forEach(({ name, Component }) => {
    describe(name, () => {
      it("transforms data correctly for PieChart", () => {
        const mockData = {
          "2023-05": {
            "Store A": 100,
            "Store B": 200,
          },
        };

        const { getByTestId } = render(<Component pieChartData={mockData} />);

        const pieChart = getByTestId("pie-chart");
        const seriesData = JSON.parse(pieChart.textContent);

        expect(seriesData[0].data).toHaveLength(2);
        expect(seriesData[0].data[0]).toEqual({
          id: 0,
          value: 100,
          label: "Store A",
        });
        expect(seriesData[0].data[1]).toEqual({
          id: 1,
          value: 200,
          label: "Store B",
        });
      });

      it("handles empty data", () => {
        const mockData = {};

        const { getByTestId } = render(<Component pieChartData={mockData} />);

        const pieChart = getByTestId("pie-chart");
        const seriesData = JSON.parse(pieChart.textContent);

        expect(seriesData[0].data).toHaveLength(0);
      });
    });
  });
});
