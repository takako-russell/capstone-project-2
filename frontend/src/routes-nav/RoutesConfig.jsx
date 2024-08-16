import React from "react";
import { Routes, Route } from "react-router-dom";
import RoutesOverride from "./Routes";
import StoreList from "../store/StoreList";

const RoutesConfig = React.memo(
  ({ stores, searchStores, removeStore, addStore, setExpense }) => {
    return (
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
        {/* <Route path="/*" element={<RoutesOverride />} /> */}
        <Route path=":storeId/items" element={<ItemList />} />
        <Route path="expense-details" element={<ExpenseDetails />} />
      </Routes>
    );
  }
);

export default RoutesConfig;
