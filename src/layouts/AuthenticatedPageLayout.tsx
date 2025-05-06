'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  BanknotesIcon,
  Bars3Icon,
  BellIcon,
  ChartBarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import React, { ReactElement, ReactNode, useState } from 'react';
import Avatar from 'react-avatar';

import SignOutModal from '@/components/signout/SignOutModal';
import { User } from '@/lib/models/User';

interface Page {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  numNotifications: number;
  current: boolean;
}

const userNavigation = [
  { name: 'Your profile', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

interface AuthenticatedLayoutProps {
  pageName: string;
  user: User;
  content: ReactNode;
}

const AuthenticatedPageLayout: React.FC<AuthenticatedLayoutProps> = ({
  pageName,
  user,
  content,
}): ReactElement => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSignOutModal, setOpenSignOutModal] = useState(false);

  const getPages: () => Page[] = (): Page[] => {
    return [
      { name: 'Dashboard', href: 'dashboard', icon: ChartBarIcon, numNotifications: 0 },
      { name: 'Transactions', href: 'transactions', icon: CreditCardIcon, numNotifications: 24 },
      { name: 'Cash', href: 'cash', icon: BanknotesIcon, numNotifications: 0 },
      { name: 'Investments', href: 'investments', icon: ChartPieIcon, numNotifications: 0 },
      {
        name: 'Retirement',
        href: 'retirement',
        icon: PresentationChartLineIcon,
        numNotifications: 0,
      },
      { name: 'Newsletters', href: 'newsletters', icon: NewspaperIcon, numNotifications: 0 },
    ].map(
      (item: {
        name: string;
        href: string;
        icon: React.FC<React.SVGProps<SVGSVGElement>>;
        numNotifications: number;
      }): Page => {
        return {
          ...item,
          current: item.name.toLowerCase() === pageName.toLowerCase(),
        };
      }
    );
  };

  const renderPageItem: (page: Page) => React.ReactElement = (page: Page): React.ReactElement => {
    return (
      <li key={page.name}>
        <a
          href={page.href}
          className={classNames(
            page.current
              ? 'bg-indigo-700 text-white'
              : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
            'group flex justify-between rounded-md p-2 text-sm/6 font-semibold'
          )}
        >
          <div className="flex gap-x-3">
            <page.icon
              aria-hidden="true"
              className={classNames(
                page.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                'size-6 shrink-0'
              )}
            />
            {page.name}
          </div>
          {page.numNotifications > 0 && (
            <span
              className={classNames(
                page.current ? 'bg-indigo-500' : 'bg-indigo-400',
                'ml-auto flex size-5 items-center justify-center rounded-full text-xs font-medium text-white'
              )}
            >
              {page.numNotifications}
            </span>
          )}
        </a>
      </li>
    );
  };

  const getUserAvatar: () => ReactElement = (): ReactElement => {
    if (!user.profile_picture_url) {
      return <Avatar name={`${user.first_name} ${user.last_name}`} size="35" round={true} />;
    }
    return (
      <Image
        alt={`${user.first_name} ${user.last_name}'s profile picture`}
        src={user.profile_picture_url}
        className="rounded-full bg-gray-50"
        width={35}
        height={35}
      />
    );
  };

  return (
    <>
      <div>
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {getPages().map(renderPageItem)}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <a
                        href="settings"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                        />
                        Settings
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {getPages().map(renderPageItem)}
                  </ul>
                </li>
                <li className="mt-auto">
                  <a
                    href="settings"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-6" />
                </button>

                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {getUserAvatar()}
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {user.first_name} {user.last_name}
                      </span>
                      <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <a
                          href={item.href}
                          onClick={(): void => setOpenSignOutModal(true)}
                          className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                        >
                          {item.name}
                        </a>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{content}</div>
          </main>
        </div>
      </div>
      <SignOutModal open={openSignOutModal} setOpen={setOpenSignOutModal} />
    </>
  );
};

export default AuthenticatedPageLayout;
