import React from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, axisClasses } from "@mui/x-charts";

// import Title from "./Title";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount: amount ?? null };
}

const data = [
  createData("Jan", 1200),
  createData("Feb", 1300),
  createData("Mar", 1600),
  createData("April", 1800),
  createData("May", 1500),
  createData("Jun", 2000),
  createData("July", 1500),
  createData("Aug", 1300),
  createData("Sep", 1500),
  createData("Oct", 1500),
  createData("Nov", 1300),
  createData("Dec", 1800),
];

export default function Chart() {
  const theme = useTheme();

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
          dataset={data}
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
