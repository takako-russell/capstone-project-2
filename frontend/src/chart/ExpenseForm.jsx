import React, { useState } from "react";
import api from "../api/api";
import "./ExpenseForm.css";

const ExpenseForm = ({ addExpenseToState, closeModal }) => {
  const initialState = { date: "", amount: "" };
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData:", formData);
    console.log(formData);

    const res = await api.addExpense(formData);
    setFormData({});
    addExpenseToState(res);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add Expense</h2>
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <label htmlFor="amount">Amount</label>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default ExpenseForm;
