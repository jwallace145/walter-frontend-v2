import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { BanknotesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { GetServerSideProps } from 'next';
import React, { ReactElement, useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import AddPortfolioStockModal from '@/components/portfolio/AddPortfolioStockModal';
import PortfolioEquityPieChart from '@/components/portfolio/PortfolioEquityPieChart';
import PortfolioStockCards from '@/components/portfolio/PortfolioStockCards';
import StockLineChart from '@/components/stock/StockLineChart';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';

export interface PortfolioStockPage {
  id: string;
  name: string;
  current: boolean;
}

const Dashboard: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [getPortfolioLoading, setGetPortfolioLoading] = useState<boolean>(false);
  const [getPricesLoading, setGetPricesLoading] = useState<boolean>(false);
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [equity, setEquity] = useState<number>(0);
  const [prices, setPrices] = useState<Price[]>([]);
  const [openAddStockModal, setOpenAddStockModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PortfolioStockPage>({
    id: 'equity',
    name: 'Equity',
    current: true,
  });

  useEffect((): void => {
    getPortfolio();
    getPrices();
  }, []);

  const getPortfolio: () => void = (): void => {
    setGetPortfolioLoading(true);
    fetch('/api/portfolios/get-portfolio', {
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: Response) => response.json())
      .then((data): void => {
        console.log(data.stocks);
        setStocks(data.stocks);
        setEquity(data.total_equity);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGetPortfolioLoading(false));
  };

  const getPrices: () => void = (): void => {
    setGetPricesLoading(true);
    fetch('/api/prices/get-prices?stock=AAPL&start_date=2025-04-01&end_date=2025-04-30')
      .then((response: Response) => response.json())
      .then((data): void => {
        setPrices(data);
      })
      .catch((error: any): void => console.error('Error:', error))
      .finally((): void => setGetPricesLoading(false));
  };

  const getPortfolioNavigation: () => { id: string; name: string; current: boolean }[] = (): {
    id: string;
    name: string;
    current: boolean;
  }[] => {
    return [
      { id: 'equity', name: 'Equity', current: currentPage.name.toLowerCase() === 'equity' },
      { id: 'shares', name: 'Shares', current: currentPage.name.toLowerCase() === 'shares' },
      { id: 'price', name: 'Price', current: currentPage.name.toLowerCase() === 'price' },
    ];
  };

  const getContent = (): React.ReactElement => (
    <>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <PortfolioEquityPieChart
              loading={getPortfolioLoading}
              stocks={stocks}
              equity={equity}
            />
          </div>
          <div className="flex-1">
            <StockLineChart
              stock={(stocks.length > 0 ? stocks[0] : null) as PortfolioStock | null}
              prices={prices}
              loading={getPricesLoading}
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between border-b border-white/5">
            {/* Page List Options */}
            <nav className="flex overflow-x-auto py-4">
              {/* Mobile List Options */}
              <div className="w-full sm:hidden">
                <Listbox value={currentPage} onChange={setCurrentPage}>
                  <div className="relative mt-2">
                    <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                      <span className="col-start-1 row-start-1 truncate pr-6">
                        {currentPage.name}
                      </span>
                      <ChevronUpDownIcon
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      />
                    </ListboxButton>

                    <ListboxOptions
                      transition
                      className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                      {getPortfolioNavigation().map(
                        (portfolioNavigation: {
                          id: string;
                          name: string;
                          current: boolean;
                        }): ReactElement => (
                          <ListboxOption
                            key={portfolioNavigation.id}
                            value={portfolioNavigation}
                            className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                          >
                            <span className="block truncate font-normal group-data-selected:font-semibold">
                              {portfolioNavigation.name}
                            </span>

                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                              <CheckIcon aria-hidden="true" className="size-5" />
                            </span>
                          </ListboxOption>
                        )
                      )}
                    </ListboxOptions>
                  </div>
                </Listbox>
              </div>

              {/* Desktop Row Options */}
              <div className="hidden sm:block">
                <ul
                  role="list"
                  className="flex flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8"
                >
                  {getPortfolioNavigation().map(
                    (item: PortfolioStockPage): ReactElement => (
                      <li key={item.name}>
                        <a
                          onClick={(): void => setCurrentPage({ ...item, current: true })}
                          className={`cursor-pointer hover:text-gray-600 ${item.current ? 'text-gray-900' : ''}`}
                        >
                          {item.name}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </nav>

            {/* Action Buttons */}
            <div className="flex gap-4 py-4 px-4 sm:px-6 lg:px-8">
              <button
                onClick={(): void => setOpenAddStockModal(true)}
                className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <BanknotesIcon aria-hidden="true" className="-ml-1.5 size-5" />
                <span className="hidden md:inline">Stocks</span>
              </button>
              <button
                onClick={(): void => console.log('Crypto')}
                className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <GlobeAltIcon aria-hidden="true" className="-ml-1.5 size-5" />
                <span className="hidden md:inline">Crypto</span>
              </button>
            </div>
          </div>

          {/* Portfolio Stock Cards */}
          <PortfolioStockCards loading={getPortfolioLoading} stocks={stocks} page={currentPage} />
        </div>
      </main>
      <AddPortfolioStockModal open={openAddStockModal} setOpen={setOpenAddStockModal} />
    </>
  );

  return <AuthenticatedPageLayout pageName="dashboard" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Dashboard;
