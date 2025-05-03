import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface CashAccountTransactionsDateRangeOption {
  name: string;
  current: boolean;
}

function classNames(...classes: any[]): any {
  return classes.filter(Boolean).join(' ');
}

const CashAccountTransactionsDateRangeOptions: React.FC = (): React.ReactElement => {
  const getTransactionDateRangeOptions: () => CashAccountTransactionsDateRangeOption[] =
    (): CashAccountTransactionsDateRangeOption[] => {
      return [
        { name: 'This Month', current: true },
        { name: 'Last Month', current: false },
        { name: 'Last Ninety Days', current: false },
        { name: 'Last Year', current: false },
      ];
    };

  return (
    <div>
      {/* Mobile List Options */}
      <div className="grid grid-cols-1 sm:hidden">
        <select
          defaultValue="Cash Flow"
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        >
          {getTransactionDateRangeOptions().map(
            (option: CashAccountTransactionsDateRangeOption): React.ReactElement => (
              <option key={option.name}>{option.name}</option>
            )
          )}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>

      {/* Desktop Row Options */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {getTransactionDateRangeOptions().map(
              (option: CashAccountTransactionsDateRangeOption): React.ReactElement => (
                <a
                  key={option.name}
                  aria-current={option.current ? 'page' : undefined}
                  onClick={(): void => {}}
                  className={classNames(
                    option.current
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap'
                  )}
                >
                  {option.name}
                </a>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CashAccountTransactionsDateRangeOptions;
