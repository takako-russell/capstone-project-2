import React, { useState } from "react";
import api from "../api/api";

const ExpenseForm = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await api.addExpense(formData);
    console.log("res:", res);
  };
};

export default ExpenseForm;
