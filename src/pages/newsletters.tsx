import { GetServerSideProps } from 'next';
import React, { ReactElement, useEffect, useState } from 'react';
import { getCookie } from 'typescript-cookie';

import LoadingSpinner from '@/components/loading/LoadingSpinner';
import NewslettersList from '@/components/newsletters/NewslettersList';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { Newsletter } from '@/lib/models/Newsletter';
import { User } from '@/lib/models/User';

const Newsletters: React.FC<{ user: User }> = ({ user }): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);

  useEffect((): void => {
    listNewsletters();
  }, []);

  const listNewsletters: () => void = (): void => {
    setLoading(true);
    fetch('/api/newsletters/list-newsletters', {
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
      },
    })
      .then((response: Response) => response.json())
      .then((data): void => setNewsletters(data))
      .finally((): void => setLoading(false));
  };

  const renderLoadingState: () => ReactElement = (): ReactElement => {
    return (
      <div className="h-96 w-full bg-white rounded-2xl p-6 shadow-md flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  };

  const renderEmptyState: () => ReactElement = (): ReactElement => {
    return (
      <div className="h-96 bg-white rounded-2xl p-6 shadow-md flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center">
          <p>No newsletters</p>
        </div>
      </div>
    );
  };

  const renderNewsletters: () => ReactElement = (): ReactElement => {
    return (
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <NewslettersList newsletters={newsletters} />
        </div>
      </div>
    );
  };

  const getContent: () => ReactElement = (): ReactElement => {
    let content: ReactElement;
    if (loading) {
      content = renderLoadingState();
    } else if (newsletters.length === 0) {
      content = renderEmptyState();
    } else {
      content = renderNewsletters();
    }

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Newsletters</h1>
        <div className="flex flex-col gap-6 md:flex-row">{content}</div>
      </main>
    );
  };

  return <AuthenticatedPageLayout pageName="newsletters" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Newsletters;
