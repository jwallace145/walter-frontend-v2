import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { ArrowDownTrayIcon, FunnelIcon, TagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Pagination from '@/components/pagination/Pagination';
import TransactionsDownloadModal from '@/components/transactions/TransactionsDownloadModal';
import TransactionsSearchModal from '@/components/transactions/TransactionsSearchModal';
import TransactionsTagModal from '@/components/transactions/TransactionsTagModal';
import { AccountTransaction } from '@/lib/models/AccountTransaction';

import TransactionsList from './TransactionsList';

const PaginatedTransactionsList: React.FC<{
  refresh: () => void;
  onUpdateTransactionSuccess: () => void;
  onDeleteTransactionSuccess: () => void;
  loading: boolean;
  transactions: AccountTransaction[];
  setTransactions: (transactions: AccountTransaction[]) => void;
  transactionsPerPage: number;
}> = ({
  refresh,
  onUpdateTransactionSuccess,
  onDeleteTransactionSuccess,
  loading,
  transactions,
  setTransactions,
  transactionsPerPage,
}): React.ReactElement => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [currentTransactions, setCurrentTransactions] = React.useState<AccountTransaction[]>([]);
  const [openSearchTransactionsModal, setOpenSearchTransactionsModal] =
    React.useState<boolean>(false);
  const [openCreateTransactionTagModal, setOpenCreateTransactionTagModal] =
    React.useState<boolean>(false);
  const [openDownloadTransactionsModal, setOpenDownloadTransactionsModal] =
    React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const totalPages: number = Math.ceil(transactions.length / transactionsPerPage);

  React.useEffect((): void => {
    const startIndex: number = (currentPage - 1) * transactionsPerPage;
    setCurrentTransactions(transactions.slice(startIndex, startIndex + transactionsPerPage));
  }, [transactions, currentPage, transactionsPerPage]);

  const handlePageChange: (page: number) => void = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSearch: (searchTerm: string) => void = (searchTerm: string): void => {
    if (!searchTerm) {
      setTransactions(transactions);
      return;
    }

    const searchTermLower: string = searchTerm.toLowerCase();
    const filteredTransactions: AccountTransaction[] = transactions.filter(
      (transaction: AccountTransaction): boolean => {
        return (
          transaction.transaction_vendor.toLowerCase().includes(searchTermLower) ||
          transaction.transaction_category.toLowerCase().includes(searchTermLower) ||
          transaction.transaction_date.toLowerCase().includes(searchTermLower)
        );
      }
    );

    setSearch(searchTerm);
    setTransactions(filteredTransactions);
  };

  return (
    <>
      {/* Transactions List */}
      <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              {search && (
                <div className="flex items-center gap-1">
                  <XMarkIcon
                    onClick={(): void => {
                      setSearch('');
                      refresh();
                    }}
                    className="size-5 text-gray-500 cursor-pointer hover:text-gray-700"
                  />
                  <span className="text-sm text-gray-500">{search}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <MagnifyingGlassIcon
                onClick={(): void => setOpenSearchTransactionsModal(true)}
                className="size-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
              <FunnelIcon className="size-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <TagIcon
                onClick={(): void => setOpenCreateTransactionTagModal(true)}
                className="size-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
              <ArrowDownTrayIcon
                onClick={(): void => setOpenDownloadTransactionsModal(true)}
                className="size-5 text-gray-500 cursor-pointer hover:text-gray-700"
              />
            </div>
          </div>
          <TransactionsList
            refresh={refresh}
            onUpdateTransactionSuccess={onUpdateTransactionSuccess}
            onDeleteTransactionSuccess={onDeleteTransactionSuccess}
            loading={loading}
            transactions={currentTransactions}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Download Transactions Modal */}
      <TransactionsSearchModal
        open={openSearchTransactionsModal}
        setOpen={setOpenSearchTransactionsModal}
        onSearch={(query: string): void => handleSearch(query)}
        onClose={(): void => setOpenSearchTransactionsModal(false)}
      />
      <TransactionsTagModal
        open={openCreateTransactionTagModal}
        setOpen={setOpenCreateTransactionTagModal}
      />
      <TransactionsDownloadModal
        open={openDownloadTransactionsModal}
        setOpen={setOpenDownloadTransactionsModal}
        transactions={transactions}
      />
    </>
  );
};

export default PaginatedTransactionsList;
