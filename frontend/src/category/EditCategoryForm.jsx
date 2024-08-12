import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, List, message } from "antd";
import ShoppingApi from "../api/api";
import "./EditCategoryForm.css";
import UserContext from "../UserContext";
import AddCategoryForm from "./AddCategoryForm";

const EditCategoryForm = ({ onFinish }) => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const { dbUser } = useContext(UserContext);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await ShoppingApi.getCategories(dbUser.id);
      const sortedCategories = fetchedCategories.sort(
        (a, b) => a.ordernumber - b.ordernumber
      );
      setCategories(sortedCategories);
    } catch (error) {
      message.error("Failed to fetch categories");
    }
  };
  const handleOrderChange = async (id, value) => {
    try {
      console.log(`Updating category ${id} with order ${value}`);
      const response = await ShoppingApi.updateCategoryOrder(id, value);
      console.log("Server response:", response);

      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, ordernumber: value } : cat
        )
      );
    } catch (error) {
      console.error("Error updating category order:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      message.error(`Failed to update category order: ${error.message}`);
    }
  };
  // const handleOrderChange = async (id, value) => {
  //   try {
  //     await ShoppingApi.updateCategoryOrder(id, value);
  //     setCategories((prevCategories) =>
  //       prevCategories.map((cat) =>
  //         cat.id === id ? { ...cat, ordernumber: value } : cat
  //       )
  //     );
  //   } catch (error) {
  //     message.error("Failed to update category order");
  //   }
  // };

  const handleSubmit = () => {
    onFinish(categories);
  };

  const openAddForm = () => {
    setShowAddForm(true);
  };

  return (
    <div>
      <Form form={form} onFinish={handleSubmit} className="edit-category-form">
        <List
          dataSource={categories}
          renderItem={(item) => (
            <List.Item key={item.id} className="category-list-item">
              <span className="category-name">{item.category}</span>
              <span className="current-order">
                Current Order: {item.ordernumber || "Not set"}
              </span>
              <Input
                type="number"
                value={item.ordernumber || ""}
                onChange={(e) => handleOrderChange(item.id, e.target.value)}
                placeholder="Order"
                className="order-input"
              />
            </List.Item>
          )}
        />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
          <Button
            type="default"
            onClick={openAddForm}
            style={{ marginLeft: "10px" }}
          >
            Add New Category
          </Button>
        </Form.Item>
      </Form>
      {showAddForm && (
        <AddCategoryForm
          addCategoryToState={fetchCategories}
          closeModal={onFinish}
        />
      )}
    </div>
  );
};

export default EditCategoryForm;
