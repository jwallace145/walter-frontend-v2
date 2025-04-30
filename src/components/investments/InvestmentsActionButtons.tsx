import { BanknotesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import React from 'react';

import AddPortfolioStockModal from '@/components/portfolio/AddPortfolioStockModal';

const InvestmentsActionButtons: React.FC = (): React.ReactElement => {
  const [openAddStockModal, setOpenAddStockModal] = React.useState<boolean>(false);
  const [openAddCryptoModal, setOpenAddCryptoModal] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex gap-4 py-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={(): void => setOpenAddStockModal(true)}
          className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <BanknotesIcon aria-hidden="true" className="-ml-1.5 size-5" />
          <span className="hidden md:inline">Stocks</span>
        </button>
        <button
          onClick={(): void => setOpenAddCryptoModal(true)}
          className="flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <GlobeAltIcon aria-hidden="true" className="-ml-1.5 size-5" />
          <span className="hidden md:inline">Crypto</span>
        </button>
      </div>

      {/* Portfolio Modals */}
      <AddPortfolioStockModal open={openAddStockModal} setOpen={setOpenAddStockModal} />
      <AddPortfolioStockModal open={openAddCryptoModal} setOpen={setOpenAddCryptoModal} />
    </>
  );
};

export default InvestmentsActionButtons;
