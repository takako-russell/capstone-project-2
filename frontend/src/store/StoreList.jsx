import React, { useState, useEffect } from "react";
import StoreCard from "./StoreCard";
import "./StoreList.css";
import { Col, Divider, Row } from "antd";
import Chart from "../chart/Chart";
import { Space, Button } from "antd";
import ExpenseModal from "../chart/ExpenseModal";
import StoreModal from "./StoreModal";

function StoreList({
  stores,
  searchStores,
  removeStore,
  addStore,
  addExpense,
}) {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);
  const openStoreModal = () => setIsStoreModalOpen(true);
  const closeStoreModal = () => setIsStoreModalOpen(false);

  useEffect(function getListOfStores() {
    searchStores();
  }, []);

  if (!stores || stores.length == 0) {
    return <div>LOADING....</div>;
  }

  function buildStoreCards() {
    let storeCards = [];
    if (stores && stores.length) {
      let cols = [];
      // let row = <Row>{cols}</Row>;

      for (let i = 0; i < stores.length; i++) {
        const s = stores[i];
        if (i % 2 == 0) {
          cols = [];
          cols.push(
            <Col span={12}>
              <StoreCard key={s.id} store={s} removeStore={removeStore} />
            </Col>
          );
          storeCards.push(
            <Row key={i} gutter={20} className="store-row">
              {cols}
            </Row>
          );
          // row.key = i;
        } else {
          cols.push(
            <Col span={12}>
              <StoreCard key={s.id} store={s} removeStore={removeStore} />
            </Col>
          );
        }
      }
    }
    return storeCards;
  }

  return (
    <div className="container">
      <Row>
        <Col span={10} offset={1}>
          <Button
            className="add-store-btn"
            type="primary"
            onClick={openStoreModal}
          >
            Add Store
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12} gutter={20}>
          <div className="store-list">
            {stores.length ? (
              <div className="store-list">{buildStoreCards()}</div>
            ) : (
              // stores.map((s) => (
              //   <StoreCard key={s.id} store={s} removeStore={removeStore} />
              // ))
              <p>No stores found</p>
            )}
          </div>
        </Col>
        {/* <div className="store-list">{buildStoreCards()}</div> */}
        <Col span={9} offset={2} gutter={20}>
          <div className="chart-container">
            <Row>
              <Chart />
            </Row>

            <Row>
              <Col span={11}>
                <Button
                  className="add-expense-button-add"
                  type="default"
                  onClick={openExpenseModal}
                >
                  Add Expense
                </Button>
              </Col>

              <Col span={11} offset={1}>
                <Button
                  className="add-expense-button-details"
                  type="default"
                  onClick={openExpenseModal}
                >
                  See Expense Details
                </Button>
              </Col>
            </Row>
            <StoreModal
              isStoreModalOpen={isStoreModalOpen}
              closeStoreModal={closeStoreModal}
              addStore={addStore}
              searchStores={searchStores}
            />
            <ExpenseModal
              isExpenseModalOpen={isExpenseModalOpen}
              closeExpenseModal={closeExpenseModal}
              addExpense={addExpense}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StoreList;
