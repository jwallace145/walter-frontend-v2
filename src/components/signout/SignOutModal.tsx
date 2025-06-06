'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React from 'react';
import { removeCookie } from 'typescript-cookie';

import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';

interface SignOutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ open, setOpen }): React.ReactElement => {
  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();
    removeCookie(WALTER_API_TOKEN_NAME);
    window.location.href = '/';
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop transition className="fixed inset-0 bg-gray-500/75 transition-opacity" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
          >
            <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-gray-900">
              Sign Out
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-gray-500">
              Are you sure you want to sign out? You will need to log in again to access your
              account.
            </DialogDescription>
            <form onSubmit={handleSignOut} className="mt-4 space-y-4">
              <div>
                {/* Sign Out Button */}
                <button
                  type="submit"
                  className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600`}
                >
                  Sign Out
                </button>
              </div>

              {/* Cancel Button */}
              <div>
                <button
                  type="button"
                  onClick={(): void => setOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 aria-label=Cancel sign-out action"
                >
                  Cancel
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default SignOutModal;
