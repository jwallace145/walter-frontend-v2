'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function Retirement(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Retirement</h1>;
  };

  return <AuthenticatedPageLayout pageName="retirement" content={getContent()} />;
}
