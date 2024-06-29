import React from "react";
import { Modal } from "antd";
import AddStoreForm from "./AddStoreForm";

const StoreModal = ({
  isStoreModalOpen,
  closeStoreModal,
  addStore,
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
        addStore(newStore);
        searchStores(); // Refresh the /stores list
      }}
      closeModal={closeStoreModal}
    />
  </Modal>
);

export default StoreModal;
