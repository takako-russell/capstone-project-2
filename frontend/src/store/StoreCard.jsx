import React from "react";
import { Link } from "react-router-dom";
import "./StoreCard.css";
import { CloseCircleOutlined } from "@ant-design/icons";
import ShoppingApi from "../api/api";
import { Col, Row, Card, Modal } from "antd";

const StoreCard = ({ store, removeStore }) => {
  const handleDeleteStore = async (store) => {
    try {
      await ShoppingApi.deleteStore(store.id);
      removeStore(store.id);
    } catch (e) {
      console.log(e);
    }
  };

  if (!store) return <div> NOT FOUND </div>;
  const { id, storeName, location } = store;

  return (
    <div className="store-card-container">
      <Link className="store-card" to={`/stores/${id}/items`}>
        <Card
          bodyStyle={{
            backgroundColor: "#443f3f",
            color: "white",
            paddingTop: 15,
            paddingRight: 15,
          }}
        >
          <Row justify="end" style={{ maxHeight: 30 }}>
            <Col>
              {" "}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  Modal.confirm({
                    title: "Are you sure you want to delete this store?",
                    onOk() {
                      handleDeleteStore(store);
                    },
                    onCancel() {
                      console.log("Cancel");
                    },
                  });
                }}
              >
                <CloseCircleOutlined style={{ fontSize: "larger" }} />
              </div>
            </Col>
          </Row>
          <Row justify="center" style={{ maxHeight: 40 }}>
            <Col>
              {" "}
              <h3 className="card-title" style={{ margin: 0 }}>
                {storeName}
              </h3>
            </Col>
          </Row>
          <Row justify="center" style={{ maxHeight: 40 }}>
            <Col>
              {" "}
              <h5>{location}</h5>
            </Col>
          </Row>
        </Card>
      </Link>
    </div>
  );
};

export default StoreCard;
