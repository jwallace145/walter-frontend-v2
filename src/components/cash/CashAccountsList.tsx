import React from 'react';
import Avatar from 'react-avatar';

import { US_DOLLAR } from '@/lib/constants/Constants';
import { CashAccount } from '@/lib/models/CashAccount';

const CashAccountsList: React.FC<{
  accounts: CashAccount[];
  totalBalance: number;
  setSelectedAccount: (account: CashAccount) => void;
}> = ({ accounts, totalBalance, setSelectedAccount }): React.ReactElement => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Accounts</h1>
      </div>

      <ul role="list" className="divide-y divide-gray-100">
        {accounts.map(
          (account: CashAccount): React.ReactElement => (
            <li
              key={account.account_id}
              onClick={(): void => setSelectedAccount(account)}
              className="relative flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex min-w-0 gap-x-4">
                <Avatar name={account.account_name} size="50" round={true} />
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
              </div>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default CashAccountsList;
