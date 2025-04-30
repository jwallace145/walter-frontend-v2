import React from 'react';

import TransactionsActionButtons from '@/components/transactions/TransactionsActionButtons';
import TransactionsDateRangeInputs from '@/components/transactions/TransactionsDateRangeInputs';
import TransactionsDateRangeOptions from '@/components/transactions/TransactionsDateRangeOptions';

const TransactionsHeader: React.FC<{
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  setOpenAddIncomeModal: (openAddIncomeModal: boolean) => void;
  setOpenAddExpenseModal: (openAddExpenseModal: boolean) => void;
}> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setOpenAddIncomeModal,
  setOpenAddExpenseModal,
}): React.ReactElement => {
  return (
    <header className="pt-6 pb-4 sm:pb-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <TransactionsDateRangeOptions setStartDate={setStartDate} setEndDate={setEndDate} />
          <TransactionsDateRangeInputs
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>
        <div className="flex justify-end">
          <TransactionsActionButtons
            setOpenAddIncomeModal={setOpenAddIncomeModal}
            setOpenAddExpenseModal={setOpenAddExpenseModal}
          />
        </div>
      </div>
    </header>
  );
};

export default TransactionsHeader;
