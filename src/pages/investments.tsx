'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function Investments(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Investments</h1>;
  };

  return <AuthenticatedPageLayout pageName="investments" content={getContent()} />;
}
