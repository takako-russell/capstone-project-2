import { PieChart } from "@mui/x-charts";
import React from "react";

const YearlyPieChart = ({ pieChartData }) => {
  const storeData = Object.values(pieChartData)[0] || {};
  const chartData = Object.entries(storeData).map(([store, sum], index) => ({
    id: index,
    value: sum,
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

export default YearlyPieChart;
