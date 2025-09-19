import React from 'react';

import Notification from './Notification';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorNotification: React.FC<{
  show: boolean;
  setShow: (show: boolean) => void;
  title: string;
  message?: string;
}> = ({ show, setShow, title, message }): React.ReactElement => {
  return (
    <Notification
      show={show}
      setShow={setShow}
      title={title}
      message={message}
      icon={<ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-500" />}
    />
  );
};

export default ErrorNotification;
