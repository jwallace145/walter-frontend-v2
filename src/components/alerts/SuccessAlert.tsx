import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { ReactElement } from 'react';

const SuccessAlert: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  message: string;
}> = ({ open, setOpen, message }): ReactElement => {
  if (!open) return <></>;

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm rounded-md bg-green-50 p-4 shadow-lg">
      <div className="flex items-start">
        <div className="shrink-0 pt-0.5">
          <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
