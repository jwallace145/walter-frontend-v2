import axios, { AxiosResponse } from 'axios';
import React, { FormEvent, ReactElement } from 'react';

import Modal from '@/components/modals/Modal';
import { CashAccount } from '@/lib/models/CashAccount';

interface AddIncomeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: () => void;
  onIncomeAdded: () => void;
  accounts: CashAccount[];
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  open,
  setOpen,
  onClose,
  onIncomeAdded,
  accounts,
}): ReactElement => {
  const [selectedAccountId, setSelectedAccountId] = React.useState('');
  const [date, setDate] = React.useState('');
  const [vendor, setVendor] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700">
            Account
          </label>
          <select
            id="account"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select an account
            </option>
            {accounts.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.bank_name} - {account.account_name} ({account.account_last_four_numbers})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
            Vendor
          </label>
          <input
            id="vendor"
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
            placeholder="e.g. Starbucks"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="e.g. 12.50"
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
            {loading ? 'Adding...' : 'Add Income'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const handleSubmit: (event: FormEvent) => Promise<void> = async (
    event: FormEvent
  ): Promise<void> => {
    event.preventDefault();

    // ensure all fields are set
    if (!date || !vendor || !amount) {
      console.log('All fields are required.');
      return;
    }

    // ensure amount is positive and a valid number
    const parsedAmount: number = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.log('Amount must be a positive number.');
      return;
    }

    // attempt to add income for user to db
    setLoading(true);
    await axios
      .post('/api/transactions/add-transaction', {
        account_id: selectedAccountId,
        date: date,
        vendor: vendor,
        amount: Math.abs(parsedAmount),
      })
      .then((response: AxiosResponse) => response.data)
      .then((data: any): void => {
        console.log(data);
        onIncomeAdded();
        setDate('');
        setVendor('');
        setAmount('');
        onClose();
      })
      .catch((err: any) => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Add Income"
      description="Payday! Add a new income transaction with the following details."
      content={getContent()}
    />
  );
};

export default AddIncomeModal;
