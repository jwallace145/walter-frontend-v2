import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { getCookie } from 'typescript-cookie';

import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';

const SettingsChangePassword: React.FC = (): React.ReactElement => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [changingPassword, setChangingPassword] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleChangePassword: (event: React.FormEvent) => void = (event): void => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setShowError(true);
      setError('Passwords do not match!');
      setMessage('Please make sure the new password matches the confirm password.');
      return;
    }

    if (newPassword === currentPassword) {
      setShowError(true);
      setError('New password cannot be the same as the current password!');
      setMessage('Please make sure the new password is different from the current password.');
      return;
    }

    setChangingPassword(true);
    axios('/api/users/update-password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getCookie(WALTER_API_TOKEN_NAME)}`,
        'Content-Type': 'application/json',
      },
      data: {
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    })
      .then((response: AxiosResponse) => response.data)
      .then((data: any): void => {
        if (data['Status'].toLowerCase() === 'success') {
          setShowSuccess(true);
          setSuccess(data['Message']);
          setMessage(
            'User password successfully updated. Please log out and log back in with your new password.'
          );
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setShowError(true);
          setError(data['Message']);
          setMessage('User password could not be updated. Please try again.');
        }
      })
      .catch((error: any): void => {
        setShowError(true);
        setError(error.message);
        setMessage(
          'Unexpected error occurred. Please try again. If the problem persists, please contact support.'
        );
      })
      .finally((): void => setChangingPassword(false));
  };

  return (
    <>
      {/* Change Password Form */}
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">Change password</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Change the password linked to your account to keep it secure.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="md:col-span-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="current-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Current password
              </label>
              <div className="mt-2">
                <input
                  id="current-password"
                  name="current_password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="new-password" className="block text-sm/6 font-medium text-gray-900">
                New password
              </label>
              <div className="mt-2">
                <input
                  id="new-password"
                  name="new_password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="confirm-password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm password
              </label>
              <div className="mt-2">
                <input
                  id="confirm-password"
                  name="confirm_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex">
            <button
              type="submit"
              disabled={changingPassword}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:bg-indigo-300"
            >
              {changingPassword ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Notifications */}
      <SuccessNotification
        show={showSuccess}
        setShow={setShowSuccess}
        title={success}
        message={message}
      />
      <ErrorNotification show={showError} setShow={setShowError} title={error} message={message} />
    </>
  );
};

export default SettingsChangePassword;
