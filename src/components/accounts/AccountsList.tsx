import { Account } from '../../lib/models/account';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

function initials(name: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return letters.join('') || name[0]?.toUpperCase() || '?';
}

function formatCurrency(amount: number) {
  if (typeof amount !== 'number' || isNaN(amount)) return '-';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function AccountsList({ accounts }: { accounts: Account[] }) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {accounts?.map((account) => (
        <li key={account.account_id} className="relative flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="size-12 flex-none rounded-full bg-gray-100 ring-1 ring-inset ring-gray-200 text-gray-600 grid place-items-center font-semibold">
              {initials(account.institution_name || account.account_name)}
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">
                <span className="absolute inset-x-0 -top-px bottom-0" />
                {account.account_name}
              </p>
              <p className="mt-1 text-xs/5 text-gray-500 truncate">{account.institution_name}</p>
              <p className="mt-1 text-xs/5 text-gray-500 truncate">
                {account.account_type}
                {account.account_subtype ? ` • ${account.account_subtype}` : ''}
              </p>
              <p className="mt-1 text-xs/5 text-gray-400 truncate">ID: {account.account_id}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm/6 text-gray-900">{formatCurrency(account.balance)}</p>
              {account.updated_at ? (
                <p className="mt-1 text-xs/5 text-gray-500">
                  Updated{' '}
                  <time dateTime={account.updated_at}>{formatDate(account.updated_at)}</time>
                </p>
              ) : null}
              <div className="mt-1 flex items-center gap-x-1.5">
                <div
                  className={`flex-none rounded-full p-1 ${account.linked_with_plaid ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}
                >
                  <div
                    className={`size-1.5 rounded-full ${account.linked_with_plaid ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  />
                </div>
                <p className="text-xs/5 text-gray-500">
                  {account.linked_with_plaid ? 'Linked' : 'Disconnected'}
                </p>
              </div>
            </div>
            <ChevronRightIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
          </div>
        </li>
      ))}
    </ul>
  );
}
