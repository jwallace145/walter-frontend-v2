import { BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

import DeleteCashAccountModal from '@/components/cash/DeleteCashAccountModal';
import UpdateCashAccountBalanceModal from '@/components/cash/UpdateCashAccountBalanceModal';
import UpdateCashAccountModal from '@/components/cash/UpdateCashAccountModal';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';

const CashAccountDescription: React.FC<{
  loading: boolean;
  account: CashAccount | undefined;
  onUpdateAccountSuccess: () => void;
  onUpdateAccountError: () => void;
  onDeleteAccountSuccess: () => void;
  onDeleteAccountError: () => void;
}> = ({
  loading,
  account,
  onUpdateAccountSuccess,
  onUpdateAccountError,
  onDeleteAccountSuccess,
  onDeleteAccountError,
}): React.ReactElement => {
  const [openUpdateCashAccountModal, setOpenUpdateCashAccountModal] =
    React.useState<boolean>(false);
  const [openDeleteCashAccountModal, setOpenDeleteCashAccountModal] =
    React.useState<boolean>(false);
  const [openUpdateCashAccountBalanceModal, setOpenUpdateCashAccountBalanceModal] =
    React.useState<boolean>(false);

  const renderLoadingState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400">
            <ChartPieIcon aria-hidden="true" className="size-12" />
          </div>
          <p className="text-sm/6 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  };

  const renderEmptyState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="text-gray-400">
            <ChartPieIcon aria-hidden="true" className="size-12" />
          </div>
          <p className="text-sm/6 text-gray-500">No cash accounts.</p>
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (!account) return renderEmptyState();

  return (
    <>
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-x-4">
              <Image src={account.logo_url} alt={account.bank_name} height={80} width={80} />
              <div>
                <h3 className="text-base/7 font-semibold text-gray-900">
                  {account.bank_name} {account.account_name}{' '}
                </h3>
                <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                  Last updated{' '}
                  {new Date(account.updated_at)
                    .toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                    .replace(',', 'th @')}
                </p>
              </div>
            </div>
            <div className="flex gap-x-2">
              <button
                type="button"
                onClick={(): void => setOpenUpdateCashAccountModal(true)}
                className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <BuildingLibraryIcon aria-hidden="true" className="-ml-1.5 size-5" />
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={(): void => setOpenDeleteCashAccountModal(true)}
                className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <TrashIcon aria-hidden="true" className="-ml-1.5 size-5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Bank</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {account?.bank_name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Account Name</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {account?.account_name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Balance</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 flex justify-between items-center">
                <div>{US_DOLLAR.format(account?.balance || 0)}</div>
                <button
                  onClick={(): void => setOpenUpdateCashAccountBalanceModal(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilSquareIcon
                    aria-hidden="true"
                    className="size-4 cursor-pointer hover:text-gray-600"
                  />
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cash Account Modals */}
      <UpdateCashAccountModal
        account={account as CashAccount}
        open={openUpdateCashAccountModal}
        setOpen={setOpenUpdateCashAccountModal}
        onUpdateAccountSuccess={onUpdateAccountSuccess}
        onUpdateAccountError={onUpdateAccountError}
      />
      <DeleteCashAccountModal
        account={account as CashAccount}
        open={openDeleteCashAccountModal}
        setOpen={setOpenDeleteCashAccountModal}
        onDeleteAccountSuccess={onDeleteAccountSuccess}
        onDeleteAccountError={onDeleteAccountError}
      />
      <UpdateCashAccountBalanceModal
        account={account as CashAccount}
        open={openUpdateCashAccountBalanceModal}
        setOpen={setOpenUpdateCashAccountBalanceModal}
        onUpdateAccountSuccess={onUpdateAccountSuccess}
        onUpdateAccountError={onUpdateAccountError}
      />
    </>
  );
};

export default CashAccountDescription;
