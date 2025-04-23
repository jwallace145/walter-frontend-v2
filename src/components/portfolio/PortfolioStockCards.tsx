import React from 'react';
import { TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { PortfolioStock } from '@/lib/PortfolioStock';

const people = [
  {
    name: 'AAPL',
    title: 'Apple Inc.',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl: `https://assets.parqet.com/logos/symbol/AAPL`,
  },
  {
    name: 'MSFT',
    title: 'Microsoft',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl: `https://assets.parqet.com/logos/symbol/MSFT`,
  },
  {
    name: 'META',
    title: 'Meta Platforms, Inc.',
    role: 'Admin',
    email: 'janecooper@example.com',
    telephone: '+1-202-555-0170',
    imageUrl: `https://assets.parqet.com/logos/symbol/META`,
  },
];

const PortfolioStockCards: React.FC<{ stocks: PortfolioStock[] }> = ({
  stocks,
}): React.ReactElement => {
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {stocks.map(
        (stock: PortfolioStock): React.ReactElement => (
          <li
            key={stock.symbol}
            className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
          >
            <div className="flex flex-1 flex-col p-8">
              <img
                alt=""
                src={`https://assets.parqet.com/logos/symbol/${stock.symbol.toUpperCase()}`}
                className="mx-auto size-32 shrink-0 rounded-full"
              />
              <h3 className="mt-6 text-sm font-medium text-gray-900">{stock.company}</h3>
              <dl className="mt-1 flex grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">{stock.symbol}</dd>
              </dl>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="flex w-0 flex-1">
                  <a
                    href="#"
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <PencilSquareIcon aria-hidden="true" className="size-5 text-gray-400" />
                    Edit
                  </a>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <a
                    href="#"
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                    <TrashIcon aria-hidden="true" className="size-5 text-gray-400" />
                    Delete
                  </a>
                </div>
              </div>
            </div>
          </li>
        )
      )}
    </ul>
  );
};

export default PortfolioStockCards;
