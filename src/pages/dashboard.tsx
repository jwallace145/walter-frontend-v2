'use client';

import { PlusSmallIcon } from '@heroicons/react/20/solid';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

import AddPortfolioStockModal from '@/components/portfolio/AddPortfolioStockModal';
import PortfolioEquityPieChart from '@/components/portfolio/PortfolioEquityPieChart';
import PortfolioStockCards from '@/components/portfolio/PortfolioStockCards';
import StockLineChart from '@/components/stock/StockLineChart';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { WalterAPI } from '@/lib/api/WalterAPI';
import { withAuthenticatedRedirect } from '@/lib/auth/AuthenticatedRedirect';
import { Portfolio } from '@/lib/models/Portfolio';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';

interface DashboardProps {
  user: User;
  stocks: PortfolioStock[];
  prices: Price[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, stocks, prices }): React.ReactElement => {
  const [openAddStockModal, setOpenAddStockModal] = useState<boolean>(false);

  const getContent = (): React.ReactElement => (
    <>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1">
            <PortfolioEquityPieChart stocks={stocks} loading={false} />
          </div>
          <div className="flex-1">
            <StockLineChart prices={prices} loading={false} />
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

export const getServerSideProps: GetServerSideProps = withAuthenticatedRedirect(async (context) => {
  const token: string = context.req.cookies[WalterAPI.TOKEN_NAME] || '';
  const portfolio: Portfolio = await WalterAPI.getPortfolio(token);
  const prices: Price[] = await WalterAPI.getPrices('AAPL', '2025-04-01', '2025-04-25');
  return {
    props: {
      stocks: portfolio.stocks,
      prices: prices,
    },
  };
});

export default Dashboard;
