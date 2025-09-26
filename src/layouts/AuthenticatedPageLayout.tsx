'use client';

import React, { ReactElement, ReactNode, useState } from 'react';

import Sidebar from '@/components/sidebars/Sidebar';
import UserProfileMenu from '@/components/users/UserProfileMenu';
import { User } from '@/lib/models/User';

import { Bars3Icon } from '@heroicons/react/24/outline';

const AuthenticatedPageLayout: React.FC<{
  pageName: string;
  user: User;
  content: ReactNode;
}> = ({ pageName, user, content }): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar pageName={pageName} open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={(): void => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div
                aria-hidden="true"
                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              />

              <UserProfileMenu user={user} />
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{content}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AuthenticatedPageLayout;
