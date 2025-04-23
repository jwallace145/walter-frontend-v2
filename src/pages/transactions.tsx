'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function Transactions(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Transactions</h1>;
  };

  return <AuthenticatedPageLayout pageName="transactions" content={getContent()} />;
}
