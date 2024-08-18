import React, { useEffect, useState, useContext } from "react";
import ShoppingApi from "../api/api";
import "./AddItemForm.css";
import { Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import CategoryModal from "../category/CategoryModal";
import UserContext from "../UserContext";

const AddItemForm = ({ storeId, addItemToState }) => {
  useEffect(() => {
    retrieveCategories();
  }, []);

  const initialState = {
    itemName: "",
    quantity: "",
    brand: "",
    purpose: "",
    category: null,
    price: null,
  };

  const [formData, setFormdata] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { dbUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata((data) => ({
      ...data,
      [name]:
        name === "category"
          ? Number(value)
          : name === "quantity" || name === "price"
          ? value === ""
            ? null
            : Number(value)
          : value,
    }));
  };

  const retrieveCategories = async () => {
    let res = await ShoppingApi.getCategories(dbUser.id);
    setCategories(res);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      quantity: formData.quantity === "" ? null : Number(formData.quantity),
    };
    let res = await ShoppingApi.addItem(dbUser.id, storeId, submissionData);
    setFormdata(initialState);
    addItemToState(res);
  };

  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  const addCategoryToState = (newCategory) => {
    setCategories((categories) => [...categories, newCategory]);
    closeCategoryModal();
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
        <label htmlFor="price" className="input-txt">
          price<span className="optional-txt">optional</span>
        </label>
        <input
          id="price"
          type="number"
          name="price"
          placeholder="price"
          value={formData?.price || ""}
          onChange={handleChange}
        />
        <div>
          <label htmlFor="category" className="input-txt">
            category
          </label>
          <div className="category-select">
            <select
              id="category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>

            {/* <Button
              type="text"
              icon={<PlusSquareOutlined />}
              onClick={(e) => {
                e.preventDefault();
                openCategoryModal();
              }}
              style={{ marginLeft: "10px", fontSize: "20px" }}
            /> */}
          </div>
        </div>

        <button type="submit" className="add-button">
          Add
        </button>
      </form>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={closeCategoryModal}
        addCategoryToState={addCategoryToState}
      />
    </>
  );
};

export default AddItemForm;
