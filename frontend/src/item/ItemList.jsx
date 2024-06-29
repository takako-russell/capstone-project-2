import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShoppingApi from "../api/api";
import AddItemForm from "./AddItemForm";
import "./ItemList.css";
import { Col, Divider, Row } from "antd";
import { Space, Button } from "antd";
import ItemModal from "./ItemModal";

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
        addItem={handleAddItem}
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
            <li key={i.id} className="item">
              <span className="item-details">
                <span className="item-name">{i.itemName}</span>
                <span className="item-quantity">x{i.quantity}</span>
                <span className="item-purpose">for: {i.purpose}</span>
                <span
                  className="item-delete"
                  onClick={() => handleDeleteItem(i.id)}
                >
                  x
                </span>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ItemList;
