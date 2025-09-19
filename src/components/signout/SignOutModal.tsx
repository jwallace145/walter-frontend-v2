'use client';

import React, { useState } from 'react';

import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';
import { WalterBackendProxy } from '@/lib/backend/proxy';
import { LogoutResponse } from '@/lib/backend/responses';

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

interface SignOutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ open, setOpen }): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSignOut = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    WalterBackendProxy.logout()
      .then((response: LogoutResponse): void => {
        if (response.isSuccess()) {
          setShowSuccess(true);
          setSuccess(response.message);
          setMessage('User successfully signed out! Redirecting to sign in...');
          window.location.href = '/';
        } else {
          console.error(response);
          setShowError(true);
          setError(response.message);
          setMessage('Error signing out user. Please try again later or contact support.');
        }
      })
      .catch((error: any): void => {
        console.error(error);
        setShowError(true);
        setMessage('Error signing out user. Please try again later or contact support.');
        setError(error.message);
      })
      .finally((): void => setLoading(false));
  };

  return (
    <>
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
                    disabled={loading}
                    className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-red-600 text-white hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>

                {/* Cancel Button */}
                <div>
                  <button
                    type="button"
                    onClick={(): void => setOpen(false)}
                    disabled={loading}
                    className={`inline-flex w-full justify-center rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 aria-label=Cancel sign-out action ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Sign Out Notifications */}
      <SuccessNotification
        show={showSuccess}
        setShow={setShowSuccess}
        title={success}
        message={message}
      />
      <ErrorNotification show={showError} setShow={setShowError} title={error} message={message} />
    </>
  );
};

export default SignOutModal;
