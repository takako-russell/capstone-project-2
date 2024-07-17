import React from "react";
import { Modal } from "antd";
import AddItemForm from "./AddItemForm";

const ItemModal = ({
  isItemModalOpen,
  closeItemModal,
  addItemToState,
  storeId,
}) => (
  <Modal open={isItemModalOpen} onCancel={closeItemModal} footer={null}>
    <AddItemForm
      storeId={storeId}
      addItemToState={addItemToState}
      closeModal={closeItemModal}
    />
  </Modal>
);

export default ItemModal;
