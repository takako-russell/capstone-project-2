import React, { useState, useEffect, useContext } from "react";
import ShoppingApi from "../api/api";
import { Row, Segmented } from "antd";
import { Col } from "antd";
import WeeklyDisplay from "./WeeklyDisplay";
import MonthlyDisplay from "./MonthlyDisplay";
import YearlyDisplay from "./YearlyDisplay";
import WeeklyPieChart from "./WeeklyPieChart";
import MonthlyPieChart from "./MonthlyPieChart";
import YearlyPieChart from "./YearlyPieChart";
import UserContext from "../UserContext";

const ExpenseDetails = () => {
  const [timeFrame, setTimeFrame] = useState("Weekly");
  const [expenseData, setExpenseData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dbUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ShoppingApi.getExpenseSum(dbUser.id, timeFrame);

        setExpenseData(data[`${timeFrame.toLowerCase()}_sums` || []]);
        setPieChartData([data[`${timeFrame.toLowerCase()}_store_sums`] || []]);
      } catch (error) {
        console.error(`Error fetching ${timeFrame} data:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timeFrame]);

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  return (
    <div>
      <Row>
        <Col push={6} span={12}>
          <Segmented
            options={["Weekly", "Monthly", "Yearly"]}
            value={timeFrame}
            onChange={handleTimeFrameChange}
          />
        </Col>
      </Row>
      <Row>
        <Col push={3} span={6}>
          {loading ? (
            <p>Loading...</p>
          ) : timeFrame === "Weekly" ? (
            <WeeklyDisplay expenseData={expenseData} />
          ) : timeFrame === "Monthly" ? (
            <MonthlyDisplay expenseData={expenseData} />
          ) : (
            <YearlyDisplay expenseData={expenseData} />
          )}
        </Col>
        <Col span={6} offset={6}>
          <Col
            push={5}
            style={{ fontSize: "25px", marginBottom: "50px", color: "gray" }}
          >
            Average Expense by Store
          </Col>
          {loading ? (
            <p>Loading...</p>
          ) : timeFrame === "Weekly" ? (
            <WeeklyPieChart pieChartData={pieChartData} />
          ) : timeFrame === "Monthly" ? (
            <MonthlyPieChart pieChartData={pieChartData} />
          ) : (
            <YearlyPieChart pieChartData={pieChartData} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ExpenseDetails;
