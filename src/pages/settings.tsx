'use client';

import AuthenticatedPageLayout from '@/layouts/AuthenticatedPageLayout';
import React, { useRef } from 'react';
import ChangeAvatarModal from '@/components/settings/ChangeAvatarModal';
import { GetServerSideProps } from 'next';
import { withAuth } from '@/lib/auth/AuthenticatedRedirect';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }): React.ReactElement => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = React.useState(false);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getContent: () => React.ReactElement = (): React.ReactElement => {
    return (
      <>
        <main>
          <h1 className="sr-only">Account Settings</h1>
          <div className="divide-y divide-white/5">
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
                    <img
                      alt=""
                      src={user.profile_picture_url}
                      className="size-24 flex-none rounded-lg bg-gray-200 object-cover"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={(): void => setOpenChangeAvatarModal(true)}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500"
                      >
                        Change avatar
                      </button>
                      <p className="mt-2 text-xs/5 text-gray-500">JPG, GIF or PNG. 1MB max.</p>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
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
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="username"
                        autoComplete="username"
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
          </div>
        </main>
        <ChangeAvatarModal open={openChangeAvatarModal} setOpen={setOpenChangeAvatarModal} />
      </>
    );
  };

  return user ? (
    <AuthenticatedPageLayout pageName="settings" user={user} content={getContent()} />
  ) : (
    <LoadingSpinner />
  );
};

export const getServerSideProps: GetServerSideProps = withAuth();

export default Settings;
