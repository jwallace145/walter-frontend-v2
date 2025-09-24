'use client';

import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

import SettingsLinkAccounts from '@/components/settings/SettingsLinkAccounts';
import SettingsPersonalInformationForm from '@/components/settings/SettingsPersonalInformationForm';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { User } from '@/lib/models/User';

const Settings: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('Accounts');

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
      { name: 'Personal Information', href: '#', current: currentPage === 'Personal Information' },
      { name: 'Accounts', href: '#', current: currentPage === 'Accounts' },
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
                      onClick={(e): void => {
                        e.preventDefault();
                        setCurrentPage(item.name);
                      }}
                      className={item.current ? 'text-gray-900' : ''}
                      aria-current={item.current ? 'page' : undefined}
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
            {currentPage === 'Accounts' && <SettingsLinkAccounts user={user} />}
            {currentPage === 'Personal Information' && (
              <SettingsPersonalInformationForm user={user} />
            )}
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
