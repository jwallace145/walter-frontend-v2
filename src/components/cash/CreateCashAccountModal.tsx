import { ChevronDownIcon } from '@heroicons/react/20/solid';
import axios, { AxiosResponse } from 'axios';
import React from 'react';

import Modal from '@/components/modals/Modal';

const CreateCashAccountModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreateAccountSuccess: () => void;
  onCreateAccountError: () => void;
}> = ({ open, setOpen, onCreateAccountSuccess, onCreateAccountError }): React.ReactElement => {
  const [bankName, setBankName] = React.useState('');
  const [accountName, setAccountName] = React.useState('');
  const [accountType, setAccountType] = React.useState('Checking');
  const [accountLastFourNumbers, setAccountLastFourNumbers] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    let accountLastFourNumbers;
    return (
      <form onSubmit={handleCreateCashAccount} className="mt-4 space-y-4">
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
            placeholder="e.g. Capital One, Goldman Sachs, etc."
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
            placeholder="e.g. Performance 360 Savings, Marcus, etc."
          />
        </div>

        <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <div className="mt-2 grid grid-cols-1">
          <select
            id="location"
            name="location"
            defaultValue="Checking"
            onChange={(e): void => setAccountType(e.target.value)}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
          >
            <option>Checking</option>
            <option>Savings</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>

        <div>
          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
            Account Last Four Numbers
          </label>
          <input
            type="text"
            name="accountLastFourNumbers"
            id="accountLastFourNumbers"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={accountLastFourNumbers}
            onChange={(e): void => setAccountLastFourNumbers(e.target.value)}
            placeholder="e.g. 1234"
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
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
            placeholder="e.g. 500"
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
            {loading ? 'Creating' : 'Create Account'}
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

  const handleCreateCashAccount: (event: React.FormEvent) => void = (
    event: React.FormEvent
  ): void => {
    event.preventDefault();
    setLoading(true);
    axios('/api/cash-accounts/create-cash-account', {
      method: 'POST',
      data: {
        bankName: bankName,
        accountName: accountName,
        accountType: accountType,
        accountLastFourNumbers: accountLastFourNumbers,
        balance: balance,
      },
    })
      .then((response: AxiosResponse) => response.data)
      .then((data) => {
        if (data['Status'] === 'Success') {
          onCreateAccountSuccess();
        } else {
          onCreateAccountError();
        }
      })
      .catch((): void => onCreateAccountError())
      .finally((): void => {
        setOpen(false);
        setLoading(false);
      });
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Create Cash Account"
      description="Create a new cash account."
      content={getContent()}
    />
  );
};

export default CreateCashAccountModal;
