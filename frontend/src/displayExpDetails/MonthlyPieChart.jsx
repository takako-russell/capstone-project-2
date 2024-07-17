import { PieChart } from "@mui/x-charts";
import React from "react";

const MonthlyPieChart = ({ pieChartData }) => {
  const storeData = Object.values(pieChartData)[0] || {};
  const chartData = Object.entries(storeData).map(([store, value], index) => ({
    id: index,
    value: value,
    label: store,
  }));

  return (
    <PieChart
      series={[
        {
          data: chartData,
        },
      ]}
      width={600}
      height={400}
    />
  );
};

export default MonthlyPieChart;
