import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { FormEvent, ReactElement, useState } from 'react';

import Modal from '@/components/modals/Modal';

interface TransactionsSearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSearch: (query: string) => void;
  onClose: () => void;
}

const TransactionsSearchModal: React.FC<TransactionsSearchModalProps> = ({
  open,
  setOpen,
  onSearch,
  onClose,
}): ReactElement => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <form onSubmit={handleSearchSubmit} className="mt-4 space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Term
          </label>
          <div className="relative mt-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              placeholder="e.g. Vendor name, amount, etc."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const handleSearchSubmit: (event: FormEvent) => void = (event) => {
    event.preventDefault();

    if (!searchQuery.trim()) {
      console.log('Search query cannot be empty.');
      return;
    }

    onSearch(searchQuery);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Search Transactions"
      description="Find past transactions quickly by entering relevant terms."
      content={getContent()}
    />
  );
};

export default TransactionsSearchModal;
