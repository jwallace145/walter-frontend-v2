'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React from 'react';

export default function settings(): React.ReactElement {
  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return <h1>Settings</h1>;
  };

  return <AuthenticatedPageLayout pageName="settings" content={getContent()} />;
}
