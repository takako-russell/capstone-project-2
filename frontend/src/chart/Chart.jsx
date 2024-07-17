import React, { useState, useEffect, useContext } from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, axisClasses } from "@mui/x-charts";
import ShoppingApi from "../api/api";
import UserContext from "../UserContext";

const generateMonthlyExpenses = async (userId) => {
  let expenses = await ShoppingApi.getAllExpenses(userId);
  let currYear = new Date().getFullYear();
  expenses = expenses.filter(
    (expense) => new Date(expense.date).getFullYear() === currYear
  );

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
    for (let i = 0; i < 12; i++) {
      if (!monthlySums[`${currYear}-${i}`]) {
        monthlySums[`${currYear}-${i}`] = 0;
      }
    }
  });
  return monthlySums;
};

const convertToChartData = (monthlySums) => {
  return Object.keys(monthlySums).map((key) => {
    const [year, month] = key.split("-");
    return {
      month: new Date(year, month).toLocaleString("default", {
        month: "short",
      }),
      year: parseInt(year),
      amount: monthlySums[key],
    };
  });
};

export default function Chart() {
  const theme = useTheme();
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dbUser } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const expenses = await generateMonthlyExpenses(dbUser.id);

        const chartData = convertToChartData(expenses);
        setMonthlyExpenses(chartData);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (monthlyExpenses.length === 0)
    return <div>No expenses data available</div>;

  return (
    <React.Fragment>
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
              dataKey: "month",
              tickNumber: 2,
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              dataKey: "amount",
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
