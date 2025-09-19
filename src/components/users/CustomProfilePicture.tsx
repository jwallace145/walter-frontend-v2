import React from 'react';
import Image from 'next/image';

const CustomProfilePicture: React.FC<{
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  width: number;
  height: number;
  rounded: boolean;
}> = ({ firstName, lastName, profilePictureUrl, width, height, rounded }): React.ReactElement => {
  return (
    <Image
      alt={`${firstName} ${lastName}'s profile picture`}
      src={profilePictureUrl}
      className={`${rounded ? 'rounded-full' : 'rounded-lg'} bg-gray-50`}
      width={width}
      height={height}
    />
  );
};

export default CustomProfilePicture;
