import React from "react";
import { Modal } from "antd";
import AddItemForm from "./AddItemForm";

const ItemModal = ({ isItemModalOpen, closeItemModal, addItem, storeId }) => (
  <Modal
    title="Add Item"
    open={isItemModalOpen}
    onCancel={closeItemModal}
    footer={null}
  >
    <AddItemForm
      storeId={storeId}
      addItem={addItem}
      closeModal={closeItemModal}
    />
  </Modal>
);

export default ItemModal;
