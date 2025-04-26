import { PlusSmallIcon } from '@heroicons/react/20/solid';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import AddPortfolioStockModal from '@/components/portfolio/AddPortfolioStockModal';
import PortfolioStockCards from '@/components/portfolio/PortfolioStockCards';
import StockLineChart from '@/components/stock/StockLineChart';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticatedRedirect } from '@/lib/auth/AuthenticatedRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';

const PortfolioEquityPieChart = dynamic(
  () => import('@/components/portfolio/PortfolioEquityPieChart'),
  { ssr: false }
);

const Dashboard: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [getPortfolioLoading, setGetPortfolioLoading] = useState<boolean>(false);
  const [getPricesLoading, setGetPricesLoading] = useState<boolean>(false);
  const [stocks, setStocks] = useState<PortfolioStock[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [openAddStockModal, setOpenAddStockModal] = useState<boolean>(false);

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
        setStocks(data.stocks);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGetPortfolioLoading(false));
  };

  const getPrices: () => void = (): void => {
    setGetPricesLoading(true);
    fetch('/api/prices/get-prices?stock=AAPL&start_date=2025-04-01&end_date=2025-04-30')
      .then((response: Response) => response.json())
      .then((data): void => {
        setPrices(data.prices);
      })
      .catch((error: any): void => console.error('Error:', error))
      .finally((): void => setGetPricesLoading(false));
  };

  const getContent = (): React.ReactElement => (
    <>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <PortfolioEquityPieChart stocks={stocks} loading={getPortfolioLoading} />
          </div>
          <div className="flex-1">
            <StockLineChart prices={[]} loading={false} />
          </div>
        </div>
        <div className="pt-4">
          <button
            onClick={(): void => setOpenAddStockModal(true)}
            className="mb-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusSmallIcon aria-hidden="true" className="-ml-1.5 size-5" />
            Add Stock
          </button>
          <PortfolioStockCards stocks={stocks} />
        </div>
      </main>
      <AddPortfolioStockModal open={openAddStockModal} setOpen={setOpenAddStockModal} />
    </>
  );

  return <AuthenticatedPageLayout pageName="dashboard" user={user} content={getContent()} />;
};

// TODO: Combine withAuthenticatedRedirect and withUnauthenticatedRedirect with boolean method arg for authenticated page
export const getServerSideProps: GetServerSideProps = withAuthenticatedRedirect();

export default Dashboard;
