import { CheckCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

import Notification from './Notification';

const SuccessNotification: React.FC<{
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
      icon={<CheckCircleIcon aria-hidden="true" className="size-6 text-green-400" />}
    />
  );
};

export default SuccessNotification;
