'use client';

import { GetServerSideProps } from 'next';
import Image from 'next/image';
import React, { ReactElement, useState } from 'react';
import Avatar from 'react-avatar';

import ChangeAvatarModal from '@/components/settings/ChangeAvatarModal';
import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import { withAuthenticationRedirect } from '@/lib/auth/AuthenticationRedirect';
import { User } from '@/lib/models/User';

const Settings: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('account');

  const getUserAvatar: () => ReactElement = (): ReactElement => {
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
                className="flex min-w-full flex-none gap-x-6 px-4 text-sm/6 font-semibold text-gray-400 sm:px-6 lg:px-8"
              >
                {getSettingsNavigation().map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(): void => setCurrentPage(item.name)}
                      className={item.current ? 'text-indigo-400' : ''}
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
            {/* Personal Information */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                <p className="mt-1 text-sm/6 text-gray-500">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full flex items-center gap-x-8">
                    {getUserAvatar()}
                    <div>
                      <button
                        type="button"
                        onClick={(): void => setOpenChangeAvatarModal(true)}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                      >
                        Change avatar
                      </button>
                      <p className="mt-2 text-xs/5 text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="first-name"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      First name
                    </label>
                    <div className="mt-2">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        defaultValue={user.first_name}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="last-name"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Last name
                    </label>
                    <div className="mt-2">
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        defaultValue={user.last_name}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        defaultValue={user.email}
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base/7 font-semibold text-gray-900">Change password</h2>
                <p className="mt-1 text-sm/6 text-gray-500">
                  Update your password associated with your account.
                </p>
              </div>

              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="current-password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Current password
                    </label>
                    <div className="mt-2">
                      <input
                        id="current-password"
                        name="current_password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="new-password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      New password
                    </label>
                    <div className="mt-2">
                      <input
                        id="new-password"
                        name="new_password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Confirm password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confirm-password"
                        name="confirm_password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <ChangeAvatarModal open={openChangeAvatarModal} setOpen={setOpenChangeAvatarModal} />
      </>
    );
  };

  return <AuthenticatedPageLayout pageName="settings" user={user} content={getContent()} />;
};

export const getServerSideProps: GetServerSideProps = withAuthenticationRedirect({
  authenticatedPage: true,
});

export default Settings;
