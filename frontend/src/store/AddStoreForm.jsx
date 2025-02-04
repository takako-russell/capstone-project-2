import React, { useContext, useState } from "react";
import ShoppingApi from "../api/api";
import "./AddStoreForm.css";
import UserContext from "../UserContext";

const AddStoreForm = ({ addStore, closeModal }) => {
  const initialState = {
    storeName: "",
    location: "",
  };

  const [formData, setFormdata] = useState(initialState);
  const { dbUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let store = await ShoppingApi.createStore(dbUser.id, formData);
    addStore(store);
    setFormdata(initialState);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit} className="add-store-form">
      <h2>Add Store</h2>
      <label htmlFor="storeName">Store Name</label>
      <input
        id="storeName"
        type="text"
        name="storeName"
        placeholder="Store Name"
        value={formData.storeName}
        onChange={handleChange}
      />
      <label htmlFor="location">Location</label>
      <input
        id="location"
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <button type="submit" className="add-button">
        Add
      </button>
    </form>
  );
};

export default AddStoreForm;
