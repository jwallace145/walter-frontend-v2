'use client';

import React from 'react';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';

export default function Retirement(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Retirement</h1>;
  };

  return <AuthenticatedPageLayout pageName="retirement" content={getContent()} />;
}
