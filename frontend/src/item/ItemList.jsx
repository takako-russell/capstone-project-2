import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ShoppingApi from "../api/api";
import "./ItemList.css";
import { Col, Row } from "antd";
import { Space, Button } from "antd";
import ItemModal from "./ItemModal";

import { Table } from "antd";
import UserContext from "../UserContext";

function ItemList() {
  const { storeId } = useParams();
  const [items, setItems] = useState([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [categories, setCategories] = useState({});
  const { dbUser } = useContext(UserContext);

  useEffect(() => {
    async function getListOfItems() {
      const itemData = await ShoppingApi.getItems(dbUser.id, storeId);
      const fetchedCategories = await ShoppingApi.getCategories(dbUser.id);

      console.log(`items fetched: ${itemData}`);

      const items = itemData.map((item) => ({
        ...item,
        key: item.id,
      }));

      const categoryMap = {};
      fetchedCategories.forEach((cat) => {
        categoryMap[cat.id] = {
          name: cat.category,
          ordernumber: cat.ordernumber,
        };
      });

      setCategories(categoryMap);
      setItems(items);
    }
    getListOfItems();
  }, [storeId]);

  const handleDeleteItem = async (itemId) => {
    try {
      await ShoppingApi.deleteItem(dbUser.id, storeId, itemId);
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
    if (!newItem) {
      console.error("Attempted to add undefined item");
      return;
    }

    const validatedItem = {
      ...newItem,
      key: newItem.id || Date.now(),
      category_id:
        newItem.category_id && categories[newItem.category_id]
          ? newItem.category_id
          : null,
    };
    setItems((items) => [...items, validatedItem]);

    closeItemModal();
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "itemName",
      key: "itemname",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Purpose",
      dataIndex: "purpose",
      key: "purpose",
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category",
      render: (category_id) => categories[category_id]?.name || "Uncategorized",
      sorter: (a, b) => {
        const orderA = categories[a.category_id]?.ordernumber ?? Infinity;
        const orderB = categories[b.category_id]?.ordernumber ?? Infinity;
        return orderA - orderB;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Button onClick={() => handleDeleteItem(record.id)} type="link" danger>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="background-item-list">
      <Row>
        <Col push={17}>
          <Button type="link" onClick={openItemModal}>
            Add Item
          </Button>
        </Col>
        <Space></Space>
      </Row>

      <ItemModal
        isItemModalOpen={isItemModalOpen}
        closeItemModal={closeItemModal}
        addItemToState={handleAddItem}
        storeId={storeId}
      />

      {items.length === 0 ? (
        <Row>
          <Col span={12} push={6} className="item">
            <Row>
              <Col push={11}>No items</Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col span={12} push={6} className="item">
            <Table columns={columns} dataSource={items} rowKey="id" />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default ItemList;
