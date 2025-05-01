import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React from 'react';

import SuccessNotification from '@/components/notifications/SuccessNotification';
import { Transaction } from '@/lib/models/Transaction';
import { downloadTransactionsAsCSV } from '@/lib/utils/Utils';

const TransactionsDownloadModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  transactions: Transaction[];
}> = ({ open, setOpen, transactions }): React.ReactElement => {
  const [success, setSuccess] = React.useState(false);

  const handleDownload: () => void = (): void => {
    downloadTransactionsAsCSV(transactions);
    setSuccess(true);
    setOpen(false);
  };

  return (
    <>
      {/* Download Transactions Modal */}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                Download Transactions
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-gray-500">
                Download your transactions as a CSV file.
              </DialogDescription>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Download
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Download Transactions Modal Alerts */}
      <SuccessNotification
        show={success}
        setShow={setSuccess}
        title="Transactions downloaded!"
        message="Your transactions have been downloaded to your computer."
      />
    </>
  );
};

export default TransactionsDownloadModal;
