import React from "react";
import { Routes, Route } from "react-router-dom";
import RoutesOverride from "./Routes";
import StoreList from "../store/StoreList";

const RoutesConfig = ({
  stores,
  searchStores,
  removeStore,
  addStore,
  setExpense,
}) => (
  <Routes>
    <Route
      index
      element={
        <StoreList
          stores={stores}
          searchStores={searchStores}
          removeStore={removeStore}
          addStore={addStore}
          setExpense={setExpense}
        />
      }
    />
    <Route
      path="/stores"
      element={
        <StoreList
          stores={stores}
          searchStores={searchStores}
          removeStore={removeStore}
          addStore={addStore}
          setExpense={setExpense}
        />
      }
    />
    <Route path="/*" element={<RoutesOverride />} />
  </Routes>
);

export default RoutesConfig;