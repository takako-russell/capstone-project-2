import React from "react";
import { Modal } from "antd";
import AddStoreForm from "./AddStoreForm";

const StoreModal = ({
  isStoreModalOpen,
  closeStoreModal,
  setStore,
  searchStores,
}) => (
  <Modal
    title="Add Store"
    open={isStoreModalOpen}
    onCancel={closeStoreModal}
    footer={null}
  >
    <AddStoreForm
      addStore={(newStore) => {
        setStore(newStore);
        searchStores();
      }}
      closeModal={closeStoreModal}
    />
  </Modal>
);

export default StoreModal;
