import { PlusCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';

import CreateCashAccountModal from '@/components/cash/CreateCashAccountModal';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';

const CashAccountsList: React.FC<{
  loading: boolean;
  accounts: CashAccount[];
  selectedAccount: CashAccount | undefined;
  setSelectedAccount: (account: CashAccount) => void;
  onCreateAccountSuccess: () => void;
  onCreateAccountError: () => void;
}> = ({
  loading,
  accounts,
  selectedAccount,
  setSelectedAccount,
  onCreateAccountSuccess,
  onCreateAccountError,
}): React.ReactElement => {
  const [openCreateAccountModal, setOpenCreateAccountModal] = React.useState<boolean>(false);

  const renderLoadingState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4">
        <LoadingSpinner />
      </div>
    );
  };

  const renderEmptyState: () => React.ReactElement = (): React.ReactElement => {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4">
        <p className="text-sm text-gray-500">You don&#39;t have any accounts yet. Add one above.</p>
      </div>
    );
  };

  const renderAccountsList: () => React.ReactElement = (): React.ReactElement => {
    return (
      <ul role="list" className="divide-y divide-gray-100">
        {accounts.map(
          (account: CashAccount): React.ReactElement => (
            <li
              key={account.account_id}
              onClick={(): void => setSelectedAccount(account)}
              className={`relative flex justify-between gap-x-6 py-5 cursor-pointer transition-all rounded-xl px-4 ${
                selectedAccount?.account_id === account.account_id
                  ? 'bg-indigo-50 border-l-4 border-indigo-500 shadow-sm ring-1 ring-indigo-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex min-w-0 gap-x-4">
                <Image src={account.logo_url} alt={account.bank_name} width={50} height={50} />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold text-gray-900">{account.account_name}</p>
                  <p className="mt-1 text-xs text-gray-500 truncate hover:underline">
                    {account.bank_name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end justify-center min-w-fit">
                <span className="text-sm font-bold text-green-600">
                  {US_DOLLAR.format(account.balance)}
                </span>
                <p className="text-xs text-gray-500 italic">
                  ****{account.account_last_four_numbers}
                </p>
                <p className="mt-1 text-xs text-gray-500 italic">
                  Updated {new Date(account.updated_at).toLocaleDateString()}
                </p>
              </div>
            </li>
          )
        )}
      </ul>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <PlusCircleIcon
          onClick={(): void => setOpenCreateAccountModal(true)}
          aria-hidden="true"
          className="size-5 text-gray-400 cursor-pointer hover:text-gray-600"
        />
      </div>
      {loading
        ? renderLoadingState()
        : accounts.length === 0
          ? renderEmptyState()
          : renderAccountsList()}

      {/* Create Cash Account Modal */}
      <CreateCashAccountModal
        open={openCreateAccountModal}
        setOpen={setOpenCreateAccountModal}
        onCreateAccountSuccess={onCreateAccountSuccess}
        onCreateAccountError={onCreateAccountError}
      />
    </>
  );
};

export default CashAccountsList;
