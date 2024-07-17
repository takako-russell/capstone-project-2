import React, { useState, useEffect, useContext } from "react";
import ShoppingApi from "../api/api";
import "./ExpenseForm.css";
import UserContext from "../UserContext";

const ExpenseForm = ({ setExpenseToState, closeModal }) => {
  const initialState = { date: "", amount: "", store_id: "" };
  const [formData, setFormData] = useState(initialState);
  const [stores, setStores] = useState([]);
  const { dbUser } = useContext(UserContext);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const fetchedStores = await ShoppingApi.getStores(dbUser.id);
        setStores(fetchedStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ShoppingApi.addExpense(dbUser.id, formData);
      setFormData(initialState);
      setExpenseToState(res);
      closeModal();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add Expense</h2>
      <label htmlFor="date">Date</label>
      <input
        type="date"
        name="date"
        value={formData.date || ""}
        onChange={handleChange}
      />
      <label htmlFor="amount">Amount</label>
      <input
        type="number"
        name="amount"
        value={formData.amount || ""}
        onChange={handleChange}
      />
      <label htmlFor="store_id">Store</label>
      <select
        name="store_id"
        value={formData.store_id || ""}
        onChange={handleChange}
        required
      >
        <option value="">Select a store</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.storeName}
          </option>
        ))}
      </select>
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default ExpenseForm;
