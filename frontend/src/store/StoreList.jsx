import React, { useState, useEffect, useContext, useCallback } from "react";
import StoreCard from "./StoreCard";
import "./StoreList.css";
import { Col, Row } from "antd";
import Chart from "../chart/Chart";
import { Button } from "antd";
import ExpenseModal from "../chart/ExpenseModal";
import StoreModal from "./StoreModal";
import Calender from "../calender/Calender";
import { NavLink } from "react-router-dom";
import UserContext from "../UserContext";

function StoreList({
  stores,
  searchStores,
  removeStore,
  addStore,
  setExpense,
}) {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  // const [hasSearched, setHasSearched] = useState(false);
  const openExpenseModal = () => setIsExpenseModalOpen(true);
  const closeExpenseModal = () => setIsExpenseModalOpen(false);
  const openStoreModal = () => setIsStoreModalOpen(true);
  const closeStoreModal = () => setIsStoreModalOpen(false);

  const { dbUser, isUserLoading, refreshUser } = useContext(UserContext);

  const fetchStores = useCallback(() => {
    console.log("fetchStores called in StoreList");
    if (!isUserLoading && dbUser) {
      console.log("Conditions met, calling searchStores from fetchStores");
      searchStores();
    }
  }, [isUserLoading, dbUser, searchStores]);

  useEffect(() => {
    console.log("StoreList useEffect triggered");
    console.log("isUserLoading:", isUserLoading);
    console.log("dbUser:", dbUser);
    if (!isUserLoading && !dbUser) {
      console.log("Attempting to refresh user data");
      refreshUser();
    } else {
      fetchStores();
    }
    // fetchStores();
  }, [isUserLoading, dbUser, fetchStores, refreshUser]);
  //   if (!isUserLoading && !dbUser) {
  //     console.log("Attempting to refresh user data");
  //     refreshUser();
  //   } else if (!isUserLoading && dbUser) {
  //     console.log("User data available, searching stores");
  //     searchStores();
  //     console.log("search did not go well");
  //     setHasSearched(true);
  //   }
  // }, [isUserLoading, dbUser, searchStores, hasSearched, refreshUser]);

  if (isUserLoading) {
    return <div>Loading user data...</div>;
  }

  if (!dbUser) {
    return <div>Loading user data. Please wait...</div>;
  }

  function buildStoreCards() {
    let storeCards = [];
    if (stores && stores.length) {
      let cols = [];

      for (let i = 0; i < stores.length; i++) {
        const s = stores[i];
        if (i % 2 == 0) {
          cols = [];
          cols.push(
            <Col key={i} span={10}>
              <StoreCard key={s.id} store={s} removeStore={removeStore} />
            </Col>
          );
          storeCards.push(
            <Row key={i} gutter={20} className="store-row">
              {cols}
            </Row>
          );
        } else {
          cols.push(
            <Col key={i + 1} span={10}>
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
        <Col style={{ fontSize: "15px", color: "gray" }} push={1} span={10}>
          Welcome {dbUser.givenName ? dbUser.givenName : dbUser.email}
        </Col>
        <Col span={10} offset={9}>
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
        <Col push={1} span={12} gutter={20}>
          <div className="store-list">
            {stores.length ? (
              <div className="store-list">{buildStoreCards()}</div>
            ) : (
              <p>No stores found</p>
            )}
          </div>
        </Col>

        <Col span={10} offset={0} gutter={20}>
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
                <NavLink to={"/expense-details"}>
                  <Button
                    className="add-expense-button-details"
                    type="default"
                    onClick={openExpenseModal}
                  >
                    See Expense Details
                  </Button>
                </NavLink>
              </Col>
            </Row>
            <Row style={{ marginTop: "70px" }}>
              <Calender />
            </Row>
            <StoreModal
              isStoreModalOpen={isStoreModalOpen}
              closeStoreModal={closeStoreModal}
              setStore={addStore}
              searchStores={searchStores}
            />
            <ExpenseModal
              isExpenseModalOpen={isExpenseModalOpen}
              closeExpenseModal={closeExpenseModal}
              setExpenseToState={setExpense}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default StoreList;
