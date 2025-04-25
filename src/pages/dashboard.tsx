'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React, { useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';
import { WALTER_API_TOKEN_NAME } from '@/pages/api/Constants';
import dynamic from 'next/dynamic';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import PortfolioStockCards from '@/components/portfolio/PortfolioStockCards';
import { PlusSmallIcon } from '@heroicons/react/20/solid';
import AddPortfolioStockModal from '@/components/portfolio/AddPortfolioStockModal';
import { User } from '@/lib/models/User';
import { withAuthenticatedRedirect } from '@/lib/auth/AuthenticatedRedirect';
import { GetServerSideProps } from 'next';

const PortfolioEquityPieChart = dynamic(
  () => import('@/components/portfolio/PortfolioEquityPieChart'),
  {
    ssr: false,
  }
);

const StockLineChart = dynamic(() => import('@/components/stock/StockLineChart'), {
  ssr: false,
});

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }): React.ReactElement => {
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
        setStocks(data['Data']['stocks']);
      })
      .catch((error): void => console.error('Error:', error))
      .finally((): void => setGetPortfolioLoading(false));
  };

  const getPrices: () => void = (): void => {
    setGetPricesLoading(true);
    fetch('/api/prices/get-prices?stock=AAPL&start_date=2025-04-01&end_date=2025-04-30')
      .then((response: Response) => response.json())
      .then((data): void => {
        setPrices(data['Data']['prices']);
      })
      .catch((error: any): void => console.error('Error:', error))
      .finally((): void => setGetPricesLoading(false));
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1">
              <PortfolioEquityPieChart loading={getPortfolioLoading} stocks={stocks} />
            </div>
            <div className="flex-1">
              <StockLineChart loading={getPricesLoading} prices={prices} />
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
  };

  return <AuthenticatedPageLayout pageName="dashboard" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticatedRedirect();

export default Dashboard;
