import React from "react";
import { Routes, Route } from "react-router-dom";
import RoutesOverride from "./Routes";
import StoreList from "../store/StoreList";
import { Space, Button } from "antd";
import AddStoreForm from "../store/AddStoreForm";

const RoutesConfig = ({
  stores,
  searchStores,
  removeStore,
  addStore,
  addExpense,
}) => (
  <Routes>
    <Route
      index // This is the index route ("localhost:5000/ etc")
      element={
        <StoreList
          stores={stores}
          searchStores={searchStores}
          removeStore={removeStore}
          addStore={addStore}
          addExpense={addExpense}
        />
      }
    />
    <Route
      path="/stores" // This is the stores route ("localhost:5000/stores")
      element={
        <StoreList
          stores={stores}
          searchStores={searchStores}
          removeStore={removeStore}
          addStore={addStore}
          addExpense={addExpense}
        />
      }
    />
    <Route path="/*" element={<RoutesOverride />} /> // This is a catch-all
    route for any other route that is not defined
  </Routes>
);

export default RoutesConfig;
