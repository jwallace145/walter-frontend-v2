import React from 'react';
import { GetServerSideProps } from 'next';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { User } from '@/lib/models/User';

const Dashboard: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const getContent = (): React.ReactElement => (
    <>
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Portfolio Allocation</h1>
      </main>
    </>
  );

  return <AuthenticatedPageLayout pageName="dashboard" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Dashboard;
