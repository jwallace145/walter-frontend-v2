import axios, { AxiosResponse } from 'axios';
import React from 'react';

import Modal from '@/components/modals/Modal';
import { CashAccount } from '@/lib/models/CashAccount';

const UpdateCashAccountModal: React.FC<{
  account: CashAccount | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdateAccountSuccess: () => void;
  onUpdateAccountError: () => void;
}> = ({
  account,
  open,
  setOpen,
  onUpdateAccountSuccess,
  onUpdateAccountError,
}): React.ReactElement => {
  const [bankName, setBankName] = React.useState<string>('');
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountBalance, setAccountBalance] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const handleSubmit: (event: React.FormEvent) => void = (event): void => {
    event.preventDefault();

    if (!bankName || !accountName || !accountBalance) {
      setError(true);
      setMessage('All fields are required.');
      return;
    }

    const parsedBalance = parseFloat(accountBalance);
    if (isNaN(parsedBalance) || parsedBalance <= 0) {
      setError(true);
      setMessage('Account balance must be a positive number!');
      return;
    }

    setLoading(true);
    axios('/api/cash-accounts/update-cash-account', {
      method: 'PUT',
      data: {
        accountId: account?.account_id,
        bankName: bankName,
        accountName: accountName,
        accountBalance: accountBalance,
      },
    })
      .then((response: AxiosResponse) => response.data)
      .then((data) => {
        setSuccess(true);
        setMessage(
          'Updated cash account successfully. You can now view updated account details in the Cash page.'
        );
        onUpdateAccountSuccess();
      })
      .catch((error: Error): void => {
        setError(true);
        setMessage(
          'Unexpected error occurred. Failed to update cash account. Please try again or contact support if the issue persists.'
        );
        onUpdateAccountError();
      })
      .finally((): void => {
        setLoading(false);
        setOpen(false);
      });
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={bankName}
            onChange={(e): void => setBankName(e.target.value)}
            placeholder={account?.bank_name}
          />
        </div>

        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
            Account Name
          </label>
          <input
            type="text"
            name="accountName"
            id="accountName"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={accountName}
            onChange={(e): void => setAccountName(e.target.value)}
            placeholder={account?.account_name}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Account Balance
          </label>
          <input
            id="accountBalance"
            type="accountBalance"
            step="0.01"
            value={accountBalance}
            onChange={(e) => setAccountBalance(e.target.value)}
            required
            placeholder={account?.balance?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
            }`}
          >
            {loading ? 'Updating' : 'Update'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      {/* Update Cash Account Modal */}
      <Modal
        open={open}
        setOpen={setOpen}
        title="Update Cash Account"
        description="Update cash account details."
        content={getContent()}
      />
    </>
  );
};

export default UpdateCashAccountModal;
