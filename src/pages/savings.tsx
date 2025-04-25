'use client';

import React from 'react';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';

export default function Savings(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Savings</h1>;
  };

  return <AuthenticatedPageLayout pageName="savings" content={getContent()} />;
}
