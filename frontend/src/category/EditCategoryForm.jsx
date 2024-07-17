import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, List, message } from "antd";
import ShoppingApi from "../api/api";
import "./EditCategoryForm.css";
import UserContext from "../UserContext";

const EditCategoryForm = ({ onFinish }) => {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const { dbUser } = useContext(UserContext);

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
      await ShoppingApi.updateCategoryOrder(dbUser.id, id, value);
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === id ? { ...cat, ordernumber: value } : cat
        )
      );
    } catch (error) {
      message.error("Failed to update category order");
    }
  };

  const handleSubmit = () => {
    onFinish(categories);
  };

  return (
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
      </Form.Item>
    </Form>
  );
};

export default EditCategoryForm;