import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import React, { ReactElement } from 'react';

import Notification from '@/components/notifications/Notification';

const WarningNotification: React.FC<{
  show: boolean;
  setShow: (show: boolean) => void;
  title: string;
  message?: string;
}> = ({ show, setShow, title, message }): ReactElement => {
  return (
    <Notification
      show={show}
      setShow={setShow}
      title={title}
      message={message}
      icon={<ExclamationCircleIcon aria-hidden="true" className="size-6 text-yellow-500" />}
    />
  );
};

export default WarningNotification;
