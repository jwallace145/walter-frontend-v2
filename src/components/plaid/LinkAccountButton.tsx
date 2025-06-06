import axios from 'axios';
import React, { useState } from 'react';

import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';

import PlaidLinkWrapper from './PlaidLinkWrapper';

const LinkAccountButton: React.FC = (): React.ReactElement => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<string>();

  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/plaid/create-link-token');
      setSuccess(true);
      setMessage('Plaid connection successful! You can now link your bank account with Plaid.');
      setLinkToken(response.data.Data.link_token);
    } catch (error) {
      setError(true);
      setMessage(
        'There was an error linking your bank account with Plaid. Please try again or contact support if the issue persists.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold transition hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Linking account...' : 'Link Account'}
      </button>
      {linkToken && <PlaidLinkWrapper linkToken={linkToken} />}
      <SuccessNotification
        show={success}
        setShow={setSuccess}
        title="Plaid connection successful!"
        message={message}
      />
      <ErrorNotification
        show={error}
        setShow={setError}
        title="There was an error linking your bank account with Plaid."
        message={message}
      />
    </>
  );
};

export default LinkAccountButton;
