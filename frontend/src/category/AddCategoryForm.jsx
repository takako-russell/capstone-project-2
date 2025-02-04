import React, { useState, useContext, useEffect } from "react";
import ShoppingApi from "../api/api";
import "./AddCategoryForm.css";
import UserContext from "../UserContext";
import { Form } from "react-router-dom";

const AddCategoryForm = ({ addCategoryToState, closeModal }) => {
  const [formData, setFormdata] = useState({ name: "" });
  const { dbUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let category = await ShoppingApi.addCategory(dbUser.id, formData);
      setFormdata({ categoryName: "" });
      closeModal();
      addCategoryToState(category);
    } catch (error) {
      console.error("Error submitting category form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-category-form">
      <label htmlFor="categoryName">Category Name</label>
      <input
        id="categoryName"
        type="text"
        name="categoryName"
        placeholder="Category Name"
        value={formData.categoryName}
        onChange={handleChange}
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
};

export default AddCategoryForm;
