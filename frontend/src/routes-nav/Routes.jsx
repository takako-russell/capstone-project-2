import React from "react";
import { Router, Route, Routes } from "react-router-dom";
import StoreList from "../store/StoreList";
import StoreCard from "../store/StoreCard";
import ItemList from "../item/ItemList";

function RoutesOverride() {
  return (
    <Routes>
      <Route path="/stores/:storeId/items" element={<ItemList />} />
    </Routes>
  );
}

export default RoutesOverride;
