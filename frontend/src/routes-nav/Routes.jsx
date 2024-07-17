import React from "react";
import { Route, Routes } from "react-router-dom";

import ItemList from "../item/ItemList";
import ExpenseDetails from "../displayExpDetails/ExpenseDetails";

function RoutesOverride() {
  return (
    <Routes>
      <Route path="/stores/:storeId/items" element={<ItemList />} />
      <Route path="/expense-details" element={<ExpenseDetails />} />
    </Routes>
  );
}

export default RoutesOverride;
