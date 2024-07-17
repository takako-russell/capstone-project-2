import React from "react";
import { Table } from "antd";

const DisplayMonthly = ({ expenseData }) => {
  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Expense",
      dataIndex: "sum",
      key: "sum",

      sorter: (a, b) => a.sum - b.sum,
    },
  ];

  return <Table columns={columns} dataSource={expenseData} rowKey="month" />;
};
export default DisplayMonthly;
