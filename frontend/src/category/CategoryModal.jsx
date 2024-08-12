import React from "react";
import { Modal } from "antd";
import AddCategoryForm from "./AddCategoryForm";

const CategoryModal = ({ isOpen, onClose, addCategoryToState }) => {
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <Modal open={isOpen} onCancel={onClose} footer={null}>
        <AddCategoryForm
          addCategoryToState={addCategoryToState}
          closeModal={onClose}
        />
      </Modal>
    </div>
  );
};
export default CategoryModal;
