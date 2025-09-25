import React, { useState } from 'react';

import { Transaction } from '@/lib/models/transaction';

import TransactionsList from './TransactionsList';

interface PaginatedTransactionsProps {
  transactions: Transaction[];
  pageSize?: number; // Number of transactions per page
}

const PaginatedTransactions: React.FC<PaginatedTransactionsProps> = ({
  transactions,
  pageSize = 10,
}): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / pageSize);

  // Compute transactions to show on current page
  const currentTransactions = transactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <TransactionsList transactions={currentTransactions} />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded border ${
                pageNum === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaginatedTransactions;
