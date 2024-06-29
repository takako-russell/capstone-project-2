import React, { useState, useEffect } from "react";
import StoreCard from "./StoreCard";
import "./StoreList.css";
import { Col, Divider, Row } from "antd";
import Chart from "../chart/Chart";
import { Space, Button } from "antd";

function StoreList({ stores, searchStores, removeStore, addExpense }) {
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
            <Chart addExpense={addExpense} />
            <Space>
              <Button type="default">Add Expense</Button>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StoreList;
