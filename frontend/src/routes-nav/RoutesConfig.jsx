import React from "react";
import { Routes, Route } from "react-router-dom";
import RoutesOverride from "./Routes";
import ItemList from "../item/ItemList";
import StoreList from "../store/StoreList";
import ExpenseDetails from "../displayExpDetails/ExpenseDetails";

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

        <Route path=":storeId/items" element={<ItemList />} />
      </Routes>
    );
  }
);

export default RoutesConfig;
