import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShoppingApi from "../api/api";
import AddItemForm from "./AddItemForm";
import "./ItemList.css";
import { Col, Divider, Row } from "antd";
import { Space, Button } from "antd";
import ItemModal from "./ItemModal";
import { CloseCircleOutlined } from "@ant-design/icons";

function ItemList() {
  const { storeId } = useParams();
  console.log(storeId);
  const [items, setItems] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  useEffect(() => {
    async function getListOfItems() {
      const items = await ShoppingApi.getItems(storeId);
      setItems(items);
    }
    getListOfItems();
  }, [storeId]);

  const handleDeleteItem = async (itemId) => {
    try {
      await ShoppingApi.deleteItem(storeId, itemId);
      setItems((items) => items.filter((i) => i.id !== itemId));
    } catch (error) {
      console.log(error);
    }
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
  };
  const openItemModal = () => {
    if (!isItemModalOpen) setIsItemModalOpen(true);
  };

  const handleAddItem = (newItem) => {
    setItems((items) => [...items, newItem]);
    closeItemModal();
    console.log("handled add item:", items);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handled submit:", e);
  };
  const handleChange = (e) => {
    console.log("handled change:", e);
  };

  return (
    <div className="background-item-list">
      <Space>
        <Button type="link" onClick={openItemModal}>
          Add Item
        </Button>
      </Space>
      {/* <button onClick={openItemModal}>Add item</button>
       */}
      <ItemModal
        isItemModalOpen={isItemModalOpen}
        closeItemModal={closeItemModal}
        addItemToState={handleAddItem}
        storeId={storeId}
      />

      {/* {isItemModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeItemModal}>
              &times;
            </span>
            <AddItemForm
              storeId={storeId}
              updateItems={handleAddItem}
              closeModal={closeItemModal}
            />
          </div>
        </div>
      )} */}
      <ul>
        {items.length === 0 ? (
          <p>NO items</p>
        ) : (
          items.map((i) => (
            // <li key={i.id} className="item">
            <Row key={i.id}>
              <Col span={12} push={6} className="item">
                <form onSubmit={handleSubmit}>
                  <span className="item-details">
                    <Row>
                      <Col span={4} push={2}>
                        <span>Name</span>
                        <input
                          type="text"
                          className="item-name"
                          name="itemName"
                          value={i.itemName}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col span={4}>
                        <span>Quantity</span>
                        <input
                          type="text"
                          className="item-quantity"
                          name="quantity"
                          value={i.quantity}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col span={4}>
                        <span>Brand:</span>
                        <input
                          type="text"
                          className="item-brand"
                          name="brand"
                          value={i.brand}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col span={4}>
                        <span>for:</span>
                        <input
                          type="text"
                          className="item-purpose"
                          name="purpose"
                          value={i.purpose}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col span={4} offset={4}>
                        <button
                          type="button"
                          className="item-delete"
                          onClick={() => handleDeleteItem(i.id)}
                        >
                          <CloseCircleOutlined style={{ fontSize: "larger" }} />
                        </button>
                      </Col>
                    </Row>
                  </span>
                </form>
              </Col>
            </Row>
            // </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ItemList;
