import React from 'react';

import Modal from '@/components/modals/Modal';
import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';
import { Transaction } from '@/lib/models/Transaction';
import { downloadTransactionsAsCSV } from '@/lib/utils/Utils';

const TransactionsDownloadModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  transactions: Transaction[];
}> = ({ open, setOpen, transactions }): React.ReactElement => {
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col space-y-2 pt-4">
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Download
        </button>
        <button
          type="button"
          onClick={(): void => setOpen(false)}
          className="w-full inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    );
  };

  const handleDownload: () => void = (): void => {
    if (transactions.length === 0) {
      setError(true);
      setOpen(false);
      return;
    }
    downloadTransactionsAsCSV(transactions);
    setSuccess(true);
    setOpen(false);
  };

  return (
    <>
      {/* Download Transactions Modal */}
      <Modal
        open={open}
        setOpen={setOpen}
        title="Download Transactions"
        description="Download your transactions as a CSV file."
        content={getContent()}
      />

      {/* Download Transactions Modal Alerts */}
      <SuccessNotification
        show={success}
        setShow={setSuccess}
        title="Transactions downloaded!"
        message="Your transactions have been downloaded to your computer."
      />
      <ErrorNotification
        show={error}
        setShow={setError}
        title="No transactions to download!"
        message="You do not have any transactions to download."
      />
    </>
  );
};

export default TransactionsDownloadModal;
