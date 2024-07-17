import React from "react";
import { Modal } from "antd";
import EditCategoryForm from "./EditCategoryForm";

const ManageCategoriesModal = ({ isOpen, onClose }) => {
  const handleFinish = (updatedCategories) => {
    console.log(
      "All categories with updated order numbers:",
      updatedCategories
    );
    onClose();
  };

  return (
    <Modal
      title="Edit Category Order"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <EditCategoryForm onFinish={handleFinish} />
    </Modal>
  );
};

export default ManageCategoriesModal;
