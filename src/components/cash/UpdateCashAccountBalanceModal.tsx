import axios from 'axios';
import React, { useState } from 'react';

import Modal from '@/components/modals/Modal';
import { CashAccount } from '@/lib/models/CashAccount';

const UpdateCashAccountBalanceModal: React.FC<{
  account: CashAccount | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdateAccountSuccess: () => void;
  onUpdateAccountError: () => void;
}> = ({ account, open, setOpen, onUpdateAccountSuccess, onUpdateAccountError }) => {
  const [accountBalance, setAccountBalance] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit: (event: React.FormEvent) => void = (event: React.FormEvent): void => {
    event.preventDefault();

    const parsedBalance = parseFloat(accountBalance);
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      setError('Account balance must be zero or greater!');
      onUpdateAccountError();
      return;
    }

    setLoading(true);

    axios('/api/cash-accounts/update-cash-account', {
      method: 'PUT',
      data: {
        accountId: account?.account_id,
        bankName: account?.bank_name,
        accountName: account?.account_name,
        accountLastFourNumbers: account?.account_last_four_numbers,
        accountBalance: parsedBalance,
      },
    })
      .then((): void => {
        onUpdateAccountSuccess();
        setOpen(false);
      })
      .catch((): void => {
        setError('Failed to update account balance. Please try again.');
        onUpdateAccountError();
      })
      .finally((): void => {
        setLoading(false);
      });
  };

  const getContent = () => (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {/* Account Balance Input */}
      <div>
        <label htmlFor="accountBalance" className="block text-sm font-medium text-gray-700">
          Account Balance
        </label>
        <input
          id="accountBalance"
          type="number"
          step="0.01"
          min="0"
          value={accountBalance}
          onChange={(e) => setAccountBalance(e.target.value)}
          required
          placeholder={
            account?.balance?.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }) || '0.00'
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {/* Action Buttons */}
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

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Update Account Balance"
      description={`Modify the balance of the cash account '${account?.account_name || ''}'.`}
      content={getContent()}
    />
  );
};

export default UpdateCashAccountBalanceModal;
