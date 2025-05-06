import React from 'react';

import CustomProfilePicture from '@/components/users/CustomProfilePicture';
import DefaultProfilePicture from '@/components/users/DefaultProfilePicture';
import { User } from '@/lib/models/User';

const UserProfilePicture: React.FC<{
  user: User;
  defaultProfilePictureSize: string;
  customProfilePictureWidth: number;
  customProfilePictureHeight: number;
  customProfilePictureRounded: boolean;
}> = ({
  user,
  defaultProfilePictureSize,
  customProfilePictureWidth,
  customProfilePictureHeight,
  customProfilePictureRounded,
}): React.ReactElement => {
  if (!user.profile_picture_url)
    return (
      <DefaultProfilePicture
        firstName={user.first_name}
        lastName={user.last_name}
        size={defaultProfilePictureSize}
      />
    );
  return (
    <CustomProfilePicture
      firstName={user.first_name}
      lastName={user.last_name}
      profilePictureUrl={user.profile_picture_url}
      width={customProfilePictureWidth}
      height={customProfilePictureHeight}
      rounded={customProfilePictureRounded}
    />
  );
};

export default UserProfilePicture;
