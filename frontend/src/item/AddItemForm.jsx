import React, { useState } from "react";
import ShoppingApi from "../api/api";
import "./AddItemForm.css";
import { Button, Modal } from "antd";

const AddItemForm = ({ storeId, addItem, closeModal }) => {
  const initialState = {
    itemName: "",
    quantity: "",
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
    console.log("formData in handleSubmit:", formData);
    let res = await ShoppingApi.addItem(storeId, formData);
    console.log("added item:", res);
    setFormdata(initialState);
    addItem(res);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
