import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
  BanknotesIcon,
  ChartBarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

export interface Page {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  numNotifications: number;
  current: boolean;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC<{
  pageName: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ pageName, open, setOpen }): React.ReactElement => {
  const getPages: () => Page[] = (): Page[] => {
    return [
      {
        name: 'Dashboard',
        href: 'dashboard',
        icon: ChartBarIcon,
        numNotifications: 0,
        current: false,
      },
      {
        name: 'Transactions',
        href: 'transactions',
        icon: CreditCardIcon,
        numNotifications: 24,
        current: false,
      },
      { name: 'Cash', href: 'cash', icon: BanknotesIcon, numNotifications: 0, current: false },
      {
        name: 'Investments',
        href: 'investments',
        icon: ChartPieIcon,
        numNotifications: 0,
        current: false,
      },
      {
        name: 'Retirement',
        href: 'retirement',
        icon: PresentationChartLineIcon,
        numNotifications: 0,
        current: false,
      },
      {
        name: 'Newsletters',
        href: 'newsletters',
        icon: NewspaperIcon,
        numNotifications: 0,
        current: false,
      },
    ].map((item: Page): Page => {
      return {
        ...item,
        current: item.name.toLowerCase() === pageName.toLowerCase(),
      };
    });
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

  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
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
                <button type="button" onClick={(): void => setOpen(false)} className="-m-2.5 p-2.5">
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
    </>
  );
};

export default Sidebar;
