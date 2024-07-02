import React, { useState } from "react";
import { Modal } from "antd";
import ExpenseForm from "./ExpenseForm";

const ExpenseModal = ({
  isExpenseModalOpen,
  closeExpenseModal,
  addExpense,
}) => (
  <Modal
    title="Add Expense"
    open={isExpenseModalOpen}
    onCancel={closeExpenseModal}
    footer={null}
  >
    <ExpenseForm
      addExpenseToState={addExpense}
      closeModal={closeExpenseModal}
    />
  </Modal>
);

export default ExpenseModal;
