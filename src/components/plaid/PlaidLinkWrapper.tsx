import React, { useEffect } from 'react';
import { PlaidAccount, PlaidLinkOnSuccessMetadata, usePlaidLink } from 'react-plaid-link';

import ErrorNotification from '@/components/notifications/ErrorNotification';
import SuccessNotification from '@/components/notifications/SuccessNotification';
import { WalterBackendProxy } from '@/lib/proxy/client';
import { ExchangePublicTokenResponse } from '@/lib/proxy/responses';

const PlaidLinkWrapper: React.FC<{
  linkToken: string;
}> = ({ linkToken }): React.ReactElement => {
  const [success, setSuccess] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>('');

  const onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => object = (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ): object => {
    const institutionName: string = metadata.institution?.name || 'UNKNOWN INSTITUTION';
    const institutionId: string = metadata.institution?.institution_id || 'UNKNOWN INSTITUTION ID';
    const accounts: {
      account_id: string;
      account_name: string;
      account_type: string;
      account_subtype: string;
      account_last_four_numbers: string;
    }[] = metadata.accounts.map(
      (
        account: PlaidAccount
      ): {
        account_id: string;
        account_name: string;
        account_type: string;
        account_subtype: string;
        account_last_four_numbers: string;
      } => {
        return {
          account_id: account.id,
          account_name: account.name,
          account_type: account.type,
          account_subtype: account.subtype,
          account_last_four_numbers: account.mask,
        };
      }
    );
    const response: object = {
      public_token: publicToken,
      institution_id: institutionId,
      institution_name: institutionName,
      accounts: accounts,
    };
    console.log(accounts);
    console.log(publicToken);
    WalterBackendProxy.exchangePublicToken(publicToken, institutionId, institutionName, accounts)
      .then((response: ExchangePublicTokenResponse): void => {
        if (response.isSuccess()) {
          setSuccess(true);
          setMessage(
            'Your account(s) are now linked with Plaid and all transactions are being synced. You can now view your account details in the Cash page.'
          );
        } else {
          setError(true);
          setMessage(
            'Unable to link account(s) with Plaid. Please try again or contact support if the issue persists.'
          );
        }
      })
      .catch((): void => {
        setError(true);
        setMessage(
          'Unable to link account(s) with Plaid. Please try again or contact support if the issue persists.'
        );
      });
    return response;
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onSuccess,
    onExit: (err, metadata) => {
      if (err) console.warn('User exited Plaid Link with error:', err);
    },
  });

  useEffect((): void => {
    if (ready) {
      open();
    }
  }, [ready, open]);

  return (
    <>
      <SuccessNotification
        show={success}
        setShow={setSuccess}
        title="Your account(s) are now linked with Plaid!"
        message={message}
      />
      <ErrorNotification
        show={error}
        setShow={setError}
        title="Unable to link your account(s) with Plaid!"
        message={message}
      />
    </>
  );
};

export default PlaidLinkWrapper;
