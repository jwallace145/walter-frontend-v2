import { BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { TrashIcon } from '@heroicons/react/20/solid';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import React from 'react';

import DeleteCashAccountModal from '@/components/cash/DeleteCashAccountModal';
import UpdateCashAccountModal from '@/components/cash/UpdateCashAccountModal';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';

const CashAccountDescription: React.FC<{ loading: boolean; account: CashAccount | null }> = ({
  loading,
  account,
}): React.ReactElement => {
  const [openUpdateCashAccountModal, setOpenUpdateCashAccountModal] =
    React.useState<boolean>(false);
  const [openDeleteCashAccountModal, setOpenDeleteCashAccountModal] =
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
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-gray-400">
            <ChartPieIcon aria-hidden="true" className="size-12" />
          </div>
          <p className="text-sm/6 text-gray-500">No cash accounts.</p>
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (!account) renderEmptyState();

  return (
    <>
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-6 sm:px-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base/7 font-semibold text-gray-900">Account Information</h3>
              <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
                The details of the given cash account.
              </p>
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
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                {US_DOLLAR.format(account?.balance || 0)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-900">Description</dt>
              <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
                consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit
                nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing
                reprehenderit deserunt qui eu.
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Cash Account Modals */}
      <UpdateCashAccountModal
        open={openUpdateCashAccountModal}
        setOpen={setOpenUpdateCashAccountModal}
      />
      <DeleteCashAccountModal
        open={openDeleteCashAccountModal}
        setOpen={setOpenDeleteCashAccountModal}
      />
    </>
  );
};

export default CashAccountDescription;
