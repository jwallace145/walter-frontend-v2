'use client';

import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';

import InvestmentsActionButtons from '@/components/investments/InvestmentsActionButtons';
import InvestmentsAssetsViewOptions, {
  AssetViewOption,
} from '@/components/investments/InvestmentsAssetsViewOptions';
import PortfolioEquityPieChart from '@/components/portfolio/PortfolioEquityPieChart';
import PortfolioStockCards from '@/components/portfolio/PortfolioStockCards';
import StockLineChart from '@/components/stock/StockLineChart';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { PortfolioStock } from '@/lib/models/PortfolioStock';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';
import { getWalterAPIToken } from '@/lib/utils/Utils';

const Investments: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [stocks, setStocks] = React.useState<PortfolioStock[]>([]);
  const [equity, setEquity] = React.useState<number>(0);
  const [prices, setPrices] = React.useState<Price[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = React.useState<boolean>(false);
  const [loadingPrices, setLoadingPrices] = React.useState<boolean>(false);
  const [assetViewOption, setAssetViewOption] = React.useState<AssetViewOption>({
    id: 'equity',
    name: 'Equity',
    current: true,
  });

  React.useEffect((): void => {
    // get backend token from cookies
    const token: string = getWalterAPIToken();

    // get user portfolio with stocks and cryptos
    setLoadingPortfolio(true);
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
      .finally((): void => setLoadingPortfolio(false));

    // get the latest prices of the included stocks and cryptos
    setLoadingPrices(true);
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
      .finally((): void => setLoadingPrices(false));
  }, [refresh]);

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main className="p-8">
          {/* Investments Page Title */}
          <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>

          {/* Investments Charts */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1">
              <PortfolioEquityPieChart stocks={stocks} equity={equity} loading={loadingPortfolio} />
            </div>
            <div className="flex-1">
              <StockLineChart
                stock={(stocks.length > 0 ? stocks[0] : null) as PortfolioStock | null}
                prices={prices}
                loading={loadingPrices}
              />
            </div>
          </div>

          <div className="pt-4">
            {/* Investments Tool Bar */}
            <div className="flex items-center justify-between border-b border-white/5">
              <InvestmentsAssetsViewOptions
                assetViewOption={assetViewOption}
                setAssetViewOption={setAssetViewOption}
              />
              <InvestmentsActionButtons refresh={(): void => setRefresh(!refresh)} />
            </div>

            {/* Portfolio Stock Cards */}
            <PortfolioStockCards
              stocks={stocks}
              assetViewOption={assetViewOption}
              loading={loadingPortfolio}
              refresh={(): void => setRefresh(!refresh)}
            />
          </div>
        </main>
      </>
    );
  };

  return <AuthenticatedPageLayout pageName="investments" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Investments;
