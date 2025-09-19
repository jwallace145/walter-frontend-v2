'use client';

import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import Avatar from 'react-avatar';

import SettingsLinkAccounts from '@/components/settings/SettingsLinkAccounts';
import SettingsPersonalInformationForm from '@/components/settings/SettingsPersonalInformationForm';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { User } from '@/lib/models/User';

const Settings: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('account');

  const getUserAvatar: () => React.ReactElement = (): React.ReactElement => {
    if (!user.profile_picture_url)
      return <Avatar name={`${user.first_name} ${user.last_name}`} size="100" round={true} />;
    return (
      <Image
        alt=""
        src={user.profile_picture_url}
        className="rounded-lg bg-gray-50"
        width={200}
        height={200}
      />
    );
  };

  const getSettingsNavigation: () => { name: string; href: string; current: boolean }[] = (): {
    name: string;
    href: string;
    current: boolean;
  }[] => {
    return [
      { name: 'Account', href: '#', current: currentPage.toLowerCase() === 'account' },
      { name: 'Subscription', href: '#', current: currentPage.toLowerCase() === 'subscription' },
      { name: 'Billing', href: '#', current: currentPage.toLowerCase() === 'billing' },
    ];
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main>
          <header className="border-b border-white/5">
            {/* Secondary navigation */}
            <nav className="flex overflow-x-auto py-4">
              <ul
                role="list"
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-500 sm:px-6 lg:px-8"
              >
                {getSettingsNavigation().map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(): void => setCurrentPage(item.name)}
                      className={item.current ? 'text-gray-900' : ''}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <h1 className="sr-only">Account Settings</h1>
          <div className="divide-y divide-white/5">
            <SettingsLinkAccounts />
            <SettingsPersonalInformationForm user={user} />
          </div>
        </main>
      </>
    );
  };

  return <AuthenticatedPageLayout pageName="settings" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Settings;
