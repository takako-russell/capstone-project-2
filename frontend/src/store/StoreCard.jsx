import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./StoreCard.css";
import { CloseCircleOutlined } from "@ant-design/icons";
import ShoppingApi from "../api/api";
import { Col, Row, Card, Modal } from "antd";
import UserContext from "../UserContext";

const StoreCard = ({ store, removeStore }) => {
  const { dbUser } = useContext(UserContext);

  const handleDeleteStore = async (store) => {
    try {
      await ShoppingApi.deleteStore(dbUser.id, store.id);
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
        <Card>
          <Row justify="end" style={{ maxHeight: 30 }}>
            <Col>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  Modal.confirm({
                    title: "Are you sure you want to delete this store?",
                    onOk() {
                      handleDeleteStore(store);
                    },
                    onCancel() {},
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
              <h5>{location}</h5>
            </Col>
          </Row>
        </Card>
      </Link>
    </div>
  );
};

export default StoreCard;
