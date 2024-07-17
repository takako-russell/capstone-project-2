import React from "react";
import { Table } from "antd";

const WeeklyDisplay = ({ expenseData }) => {
  const columns = [
    {
      title: "Week",
      dataIndex: "start_date",
      key: "week",
    },
    {
      title: "Expense",
      dataIndex: "sum",
      key: "sum",

      sorter: (a, b) => a.sum - b.sum,
    },
  ];

  return <Table columns={columns} dataSource={expenseData} rowKey="week" />;
};
export default WeeklyDisplay;
