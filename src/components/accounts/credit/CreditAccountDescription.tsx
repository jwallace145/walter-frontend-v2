import React from 'react';
import Image from 'next/image';

import { US_DOLLAR } from '@/lib/constants/Constants';
import { CreditAccount } from '@/lib/models/CreditAccount';

import { BuildingLibraryIcon } from '@heroicons/react/16/solid';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ChartPieIcon } from '@heroicons/react/24/outline';

const CreditAccountDescription: React.FC<{
  loading: boolean;
  account: CreditAccount | undefined;
  onUpdateCreditAccountSuccess: () => void;
  onUpdateCreditAccountError: () => void;
  onDeleteCreditAccountSuccess: () => void;
  onDeleteCreditAccountError: () => void;
}> = ({
  loading,
  account,
  onUpdateCreditAccountSuccess,
  onUpdateCreditAccountError,
  onDeleteCreditAccountSuccess,
  onDeleteCreditAccountError,
}): React.ReactElement => {
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
                onClick={(): void => console.log('update account')}
                className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <BuildingLibraryIcon aria-hidden="true" className="-ml-1.5 size-5" />
                <span>Update</span>
              </button>
              <button
                type="button"
                onClick={(): void => console.log('delete account')}
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
                  onClick={(): void => console.log('update balance')}
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

      {/* Credit Account Modals */}
    </>
  );
};

export default CreditAccountDescription;
