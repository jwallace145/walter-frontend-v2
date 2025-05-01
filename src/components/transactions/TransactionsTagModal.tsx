import { TagIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Modal from '@/components/modals/Modal';

const TransactionsTagModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }): React.ReactElement => {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <form className="mt-4 space-y-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            required
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter tag name..."
          />
        </div>
        <div className="flex flex-col space-y-2 pt-4">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Tag
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Create Tag"
      description="Create tags to uniquely categorize your transactions for greater insights."
      content={getContent()}
    />
  );
};

export default TransactionsTagModal;
