import Image from 'next/image';
import React, { useState } from 'react';
import Avatar from 'react-avatar';

import ChangeAvatarModal from '@/components/settings/ChangeAvatarModal';
import UserProfilePicture from '@/components/users/UserProfilePicture';
import { User } from '@/lib/models/User';

const SettingsPersonalInformationForm: React.FC<{
  user: User;
}> = ({ user }): React.ReactElement => {
  const [openChangeAvatarModal, setOpenChangeAvatarModal] = useState(false);

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

  return (
    <>
      {/* Personal Information */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Keep your personal information up to date to help us deliver smarter, more personalized
            insights. Walter uses this information exclusively to craft highly tailored financial
            newsletters just for you.
          </p>
        </div>
        <form className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full flex items-center gap-x-8">
              <UserProfilePicture
                user={user}
                defaultProfilePictureSize="100"
                customProfilePictureWidth={200}
                customProfilePictureHeight={200}
                customProfilePictureRounded={false}
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
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm/6 font-medium text-gray-900">
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
              <label htmlFor="last-name" className="block text-sm/6 font-medium text-gray-900">
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

      {/* Change Profile Picture Modal */}
      <ChangeAvatarModal open={openChangeAvatarModal} setOpen={setOpenChangeAvatarModal} />
    </>
  );
};

export default SettingsPersonalInformationForm;
