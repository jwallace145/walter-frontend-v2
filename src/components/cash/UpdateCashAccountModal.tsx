import React from 'react';

import Modal from '@/components/modals/Modal';

const UpdateCashAccountModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }): React.ReactElement => {
  const [bankName, setBankName] = React.useState<string>('');
  const [accountName, setAccountName] = React.useState<string>('');
  const [accountBalance, setAccountBalance] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit: (event: React.FormEvent) => void = (event): void => {
    event.preventDefault();
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
    <Modal
      open={open}
      setOpen={setOpen}
      title="Update Cash Account"
      description="Update cash account details."
      content={getContent()}
    />
  );
};

export default UpdateCashAccountModal;
