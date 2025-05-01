import { BanknotesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';

import PortfolioEquityPieChart from '@/components/portfolio/PortfolioEquityPieChart';
import StockLineChart from '@/components/stock/StockLineChart';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';
import { getWalterAPIToken } from '@/lib/utils/Utils';

const Dashboard: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [stocks, setStocks] = React.useState<PortfolioStock[]>([]);
  const [equity, setEquity] = React.useState<number>(0);
  const [prices, setPrices] = React.useState<Price[]>([]);
  const [gettingPortfolio, setGettingPortfolio] = React.useState<boolean>(false);
  const [gettingPrices, setGettingPrices] = React.useState<boolean>(false);
  const [openAddStockModal, setOpenAddStockModal] = React.useState<boolean>(false);
  // TODO: Move current page logic to its own component
  const [currentPage, setCurrentPage] = React.useState<{
    id: string;
    name: string;
    current: boolean;
  }>({
    id: 'equity',
    name: 'Equity',
    current: true,
  });

  React.useEffect((): void => {
    // get api token from cookies
    const token: string = getWalterAPIToken();

    // get user portfolio with stocks and cryptos
    setGettingPortfolio(true);
    axios('/api/portfolios/get-portfolio', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response): void => {
        setStocks(response.data.stocks);
        setEquity(response.data.total_equity);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGettingPortfolio(false));

    // get the latest prices of the included stocks and cryptos
    setGettingPrices(true);
    axios('/api/prices/get-prices?stock=AAPL&start_date=2025-04-01&end_date=2025-04-30', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response): void => {
        setPrices(response.data);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGettingPrices(false));
  }, []);

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
            <PortfolioEquityPieChart loading={gettingPortfolio} stocks={stocks} equity={equity} />
          </div>
          <div className="flex-1">
            <StockLineChart
              stock={(stocks.length > 0 ? stocks[0] : null) as PortfolioStock | null}
              prices={prices}
              loading={gettingPrices}
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between border-b border-white/5">
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
        </div>
      </main>
    </>
  );

  return <AuthenticatedPageLayout pageName="dashboard" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Dashboard;
