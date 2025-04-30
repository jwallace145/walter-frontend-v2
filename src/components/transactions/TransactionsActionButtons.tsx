import { BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import React from 'react';

const TransactionsActionButtons: React.FC<{
  setOpenAddIncomeModal: (openAddIncomeModal: boolean) => void;
  setOpenAddExpenseModal: (openAddExpenseModal: boolean) => void;
}> = ({ setOpenAddIncomeModal, setOpenAddExpenseModal }): React.ReactElement => {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      <button
        type="button"
        onClick={(): void => setOpenAddIncomeModal(true)}
        className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <BanknotesIcon aria-hidden="true" className="-ml-1.5 size-5" />
        <span>Income</span>
      </button>

      <button
        type="button"
        onClick={(): void => setOpenAddExpenseModal(true)}
        className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <CreditCardIcon aria-hidden="true" className="-ml-1.5 size-5" />
        <span>Expense</span>
      </button>
    </div>
  );
};

export default TransactionsActionButtons;
