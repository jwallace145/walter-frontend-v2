import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

const Modal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  content?: React.ReactElement;
}> = ({ open, setOpen, title, description, content }): React.ReactElement => {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={(): void => setOpen(false)}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-gray-500">
              {description}
            </DialogDescription>
            {content}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
