import React from "react";
import { Modal } from "antd";
import ExpenseForm from "./ExpenseForm";

const ExpenseModal = ({
  isExpenseModalOpen,
  closeExpenseModal,
  setExpenseToState,
}) => (
  <Modal
    title="Add Expense"
    open={isExpenseModalOpen}
    onCancel={closeExpenseModal}
    footer={null}
  >
    <ExpenseForm
      setExpenseToState={setExpenseToState}
      closeModal={closeExpenseModal}
    />
  </Modal>
);

export default ExpenseModal;
