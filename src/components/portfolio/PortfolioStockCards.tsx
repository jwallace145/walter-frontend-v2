import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import React, { ReactElement, useState } from 'react';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import DeletePortfolioStockModal from '@/components/portfolio/DeletePortfolioStockModal';
import { US_DOLLAR } from '@/lib/constants/Constants';
import { PortfolioStock } from '@/lib/models/PortfolioStock';

const PortfolioStockCards: React.FC<{ loading: boolean; stocks: PortfolioStock[] }> = ({
  loading,
  stocks,
}): ReactElement => {
  const [selectedPortfolioStock, setSelectedPortfolioStock] = useState<PortfolioStock | null>(null);
  const [openDeletePortfolioStock, setOpenDeletePortfolioStock] = useState<boolean>(false);

  const renderLoadingState: () => ReactElement = (): ReactElement => {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm">
          <div className="flex flex-1 flex-col p-8">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState: () => ReactElement = (): ReactElement => {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm">
          <div className="flex flex-1 flex-col p-8">
            <button
              type="button"
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden"
            >
              <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Add stock to your portfolio
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();

  if (stocks.length === 0) return renderEmptyState();

  console.log(stocks[0].logo_url);

  return (
    <>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {stocks.map(
          (stock: PortfolioStock): React.ReactElement => (
            <li
              key={stock.symbol}
              className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
            >
              <div className="flex flex-1 flex-col p-8">
                <object type="image/svg+xml" data={stock.logo_url} className="mx-auto w-32 h-32" />
                <h3 className="mt-6 text-sm font-medium text-gray-900">{stock.company}</h3>
                <dl className="mt-1 flex grow flex-col justify-between">
                  <dt className="sr-only">Title</dt>
                  <dd className="text-sm text-gray-500">{stock.symbol}</dd>
                  <dt className="mt-3 sr-only">Equity</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-700">
                    {US_DOLLAR.format(stock.equity)}
                  </dd>
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
                      onClick={(): void => {
                        setSelectedPortfolioStock(stock);
                        setOpenDeletePortfolioStock(true);
                      }}
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
      <DeletePortfolioStockModal
        open={openDeletePortfolioStock}
        setOpen={setOpenDeletePortfolioStock}
        stock={selectedPortfolioStock}
      />
    </>
  );
};

export default PortfolioStockCards;
