import React, { useState } from "react";
import { Table } from "antd";

const YearlyDisplay = ({ expenseData }) => {
  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Expense",
      dataIndex: "amount",
      key: "amount",

      sorter: (a, b) => a.sum - b.sum,
    },
  ];

  return <Table columns={columns} dataSource={expenseData} rowKey="year" />;
};
export default YearlyDisplay;
