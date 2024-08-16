import React from "react";
import { Routes, Route } from "react-router-dom";
import StoreList from "../store/StoreList";
import ItemList from "../item/ItemList";
import ExpenseDetails from "../displayExpDetails/ExpenseDetails";

const RoutesConfig = React.memo(
  ({ stores, searchStores, removeStore, addStore, setExpense }) => {
    return (
      <Routes>
        {/* <Route
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
        /> */}
        <Route path="/" element={<StoreList />} />
        <Route path="stores/:storeId/items" element={<ItemList />} />
        <Route path="expense-details" element={<ExpenseDetails />} />
      </Routes>
    );
  }
);

export default RoutesConfig;
