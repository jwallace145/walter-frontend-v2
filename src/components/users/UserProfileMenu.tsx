import React from 'react';

import SignOutModal from '@/components/signout/SignOutModal';
import UserProfilePicture from '@/components/users/UserProfilePicture';
import { User } from '@/lib/models/User';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const UserProfileMenu: React.FC<{ user: User }> = ({ user }): React.ReactElement => {
  const [openSignOutModal, setOpenSignOutModal] = React.useState<boolean>(false);

  const getMenuItems: () => { name: string; onClick: () => void }[] = (): {
    name: string;
    onClick: () => void;
  }[] => {
    return [
      {
        name: 'Settings',
        onClick: (): void => {
          window.location.href = '/settings';
        },
      },
      {
        name: 'Sign Out',
        onClick: (): void => setOpenSignOutModal(true),
      },
    ];
  };

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <UserProfilePicture
            user={user}
            defaultProfilePictureSize="35"
            customProfilePictureWidth={35}
            customProfilePictureHeight={35}
            customProfilePictureRounded={true}
          />
          <span className="hidden lg:flex lg:items-center">
            <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
              {user.first_name} {user.last_name}
            </span>
            <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
          </span>
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {getMenuItems().map((item: { name: string; onClick: () => void }): React.ReactElement => {
            return (
              <MenuItem key={item.name}>
                <button
                  onClick={item.onClick}
                  type="button"
                  className="block w-full px-3 py-1 text-left text-sm/6 text-gray-900 hover:bg-gray-50 cursor-pointer data-focus:bg-gray-50 data-focus:outline-hidden"
                >
                  {item.name}
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Menu>
      <SignOutModal open={openSignOutModal} setOpen={setOpenSignOutModal} />
    </>
  );
};

export default UserProfileMenu;
