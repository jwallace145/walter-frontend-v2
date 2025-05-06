import React from 'react';
import Avatar from 'react-avatar';

const DefaultProfilePicture: React.FC<{
  firstName: string;
  lastName: string;
  size: string;
}> = ({ firstName, lastName, size }): React.ReactElement => {
  return <Avatar name={`${firstName} ${lastName}`} size={size} round={true} />;
};

export default DefaultProfilePicture;
