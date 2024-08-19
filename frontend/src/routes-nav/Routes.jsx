import React from "react";
import { Routes, Route } from "react-router-dom";
import ItemList from "../item/ItemList";
import ExpenseDetails from "../displayExpDetails/ExpenseDetails";

const RoutesConfig = React.memo(
  ({ stores, searchStores, removeStore, addStore, setExpense }) => {
    return (
      <Routes>
        <Route path=":storeId/items" element={<ItemList />} />
        <Route path="expense-details" element={<ExpenseDetails />} />
      </Routes>
    );
  }
);

export default RoutesConfig;
