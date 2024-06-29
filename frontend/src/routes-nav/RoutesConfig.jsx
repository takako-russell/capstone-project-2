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
  showAddStoreModal,
}) => (
  <Routes>
    <Route
      path="/stores"
      element={
        <div>
          <Space>
            <Button type="link" onClick={showAddStoreModal}>
              Add Store
            </Button>
          </Space>
          <StoreList
            stores={stores}
            searchStores={searchStores}
            removeStore={removeStore}
          />
        </div>
      }
    />
    <Route path="/*" element={<RoutesOverride />} />
  </Routes>
);

export default RoutesConfig;
