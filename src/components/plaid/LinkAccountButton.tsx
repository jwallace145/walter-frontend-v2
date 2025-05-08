// LinkAccountButton.tsx

import axios from 'axios';
import React, { useState } from 'react';

import PlaidLinkWrapper from './PlaidLinkWrapper';

const LinkAccountButton: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('/api/plaid/create-link-token');
      setLinkToken(response.data.Data.link_token);
    } catch (error) {
      console.error('Failed to fetch link token:', error);
      alert('Failed to generate link token. Please try again.');
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
    </>
  );
};

export default LinkAccountButton;
