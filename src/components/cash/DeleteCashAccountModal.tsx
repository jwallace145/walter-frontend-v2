import axios, { AxiosResponse } from 'axios';
import React from 'react';

import Modal from '@/components/modals/Modal';
import { CashAccount } from '@/lib/models/CashAccount';

const DeleteCashAccountModal: React.FC<{
  account: CashAccount | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteAccountSuccess: () => void;
  onDeleteAccountError: () => void;
}> = ({
  account,
  open,
  setOpen,
  onDeleteAccountSuccess,
  onDeleteAccountError,
}): React.ReactElement => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleDelete = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    setLoading(true);
    axios('/api/cash-accounts/delete-cash-account', {
      method: 'DELETE',
      data: {
        accountId: account?.account_id,
      },
    })
      .then((response: AxiosResponse) => response.data)
      .then((data) => {
        if (data['Status'] === 'Success') {
          onDeleteAccountSuccess();
        } else {
          onDeleteAccountError();
        }
      })
      .catch((): void => onDeleteAccountError())
      .finally((): void => {
        setLoading(false);
        setOpen(false);
      });
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <form onSubmit={handleDelete} className="mt-4 space-y-4">
        <div className="flex flex-col space-y-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
            }`}
          >
            {loading ? 'Deleting...' : 'Delete'}
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
      title="Delete Cash Account"
      description="Confirm you want to delete this cash account."
      content={getContent()}
    />
  );
};

export default DeleteCashAccountModal;
