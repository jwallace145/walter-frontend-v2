import React from 'react';

import LinkAccountButton from '@/components/plaid/LinkAccountButton';

const SettingsLinkAccounts: React.FC = (): React.ReactElement => {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Link Accounts</h2>
        <p className="mt-1 text-sm text-gray-500">
          Link your financial accounts with Plaid so Walter can automatically track your expenses
          and income.
        </p>
      </div>
      <div className="md:col-span-2 flex items-start">
        <div className="p-4">
          <LinkAccountButton />
        </div>
      </div>
    </div>
  );
};

export default SettingsLinkAccounts;
