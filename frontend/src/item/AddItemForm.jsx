import React, { useState } from "react";
import ShoppingApi from "../api/api";
import "./AddItemForm.css";
import { Button, Modal } from "antd";

const AddItemForm = ({ storeId, addItemToState }) => {
  const initialState = {
    itemName: "",
    quantity: "",
    brand: "",
    purpose: "",
  };

  const [formData, setFormdata] = useState(initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res = await ShoppingApi.addItem(storeId, formData);
    setFormdata(initialState);
    addItemToState(res);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="add-item-form">
        <h2>Add Item</h2>
        <label htmlFor="itemName">Item</label>
        <input
          id="itemName"
          type="text"
          name="itemName"
          placeholder="item"
          value={formData?.itemName || ""}
          onChange={handleChange}
        />
        <label htmlFor="brand" className="input-txt">
          brand<span className="optional-txt">optional</span>
        </label>
        <input
          id="brand"
          type="text"
          name="brand"
          placeholder="brand"
          value={formData?.brand || ""}
          onChange={handleChange}
        />
        <label htmlFor="quantity" className="input-txt">
          quantity<span className="optional-txt">optional</span>
        </label>
        <input
          id="quantity"
          type="number"
          name="quantity"
          placeholder="quantity"
          value={formData?.quantity || ""}
          onChange={handleChange}
        />
        <label htmlFor="purpose" className="input-txt">
          purpose<span className="optional-txt">optional</span>
        </label>
        <input
          id="purpose"
          type="text"
          name="purpose"
          placeholder="purpose"
          value={formData?.purpose || ""}
          onChange={handleChange}
        />
        <button className="add-button">Add</button>
      </form>
    </>
  );
};

export default AddItemForm;
