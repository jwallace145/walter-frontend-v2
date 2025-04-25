'use client';

import React from 'react';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';

export default function Newsletters(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Newsletters</h1>;
  };

  return <AuthenticatedPageLayout pageName="newsletters" content={getContent()} />;
}
