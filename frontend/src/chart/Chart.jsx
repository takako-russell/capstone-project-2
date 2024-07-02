import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, axisClasses } from "@mui/x-charts";
import ShoppingApi from "../api/api";

const generateMonthlyExpenses = async () => {
  let expenses = await ShoppingApi.getAllExpenses();
  console.log(expenses);
  const monthlySums = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    const month = date.getMonth();
    const year = date.getFullYear();

    const key = `${year}-${month}`;

    if (!monthlySums[key]) {
      monthlySums[key] = 0;
    }

    monthlySums[key] += expense.amount;
    console.log(monthlySums);
  });
  return monthlySums;
};

const convertToChartData = (monthlySums) => {
  const data = [];

  return Object.keys(monthlySums).map((key) => {
    const [year, month] = key.split("-");
    return {
      month: new Date(year, month).toLocaleString("default", { month: "long" }),
      year: parseInt(year),
      amount: monthlySums[key],
    };
  });
};

// const data = [
//   createData("Jan", 1200),
//   createData("Feb", 1300),
//   createData("Mar", 1600),
//   createData("April", 1800),
//   createData("May", 1500),
//   createData("Jun", 2000),
//   createData("July", 1500),
//   createData("Aug", 1300),
//   createData("Sep", 1500),
//   createData("Oct", 1500),
//   createData("Nov", 1300),
//   createData("Dec", 1800),
// ];

export default function Chart() {
  const theme = useTheme();
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  useEffect(() => {
    const expenses = generateMonthlyExpenses();
    const chartData = convertToChartData(expenses);
    setMonthlyExpenses(chartData);
  }, []);

  return (
    <React.Fragment>
      {/* <Title>Today</Title> */}
      <div
        style={{
          width: "100%",
          height: "100%",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <LineChart
          dataset={monthlyExpenses}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          width={500}
          height={300}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "time",
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: "Expense ($)",
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              max: 2500,
              tickNumber: 3,
            },
          ]}
          series={[
            {
              curve: "linear",
              dataKey: "amount",
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: {
              stroke: theme.palette.text.secondary,
            },
            [`.${axisClasses.root} text`]: {
              fill: theme.palette.text.secondary,
            },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translateX(-25px)",
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
