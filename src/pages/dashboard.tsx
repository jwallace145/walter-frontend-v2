'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function Dashboard(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Dashboard</h1>;
  };

  return <AuthenticatedPageLayout pageName="dashboard" content={getContent()} />;
}
