import { serialize } from 'cookie';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { WalterBackend } from '@/lib/backend/Client';
import { GetUserResponse } from '@/lib/backend/GetUser';
import { RefreshResponse } from '@/lib/backend/Refresh';
import { User } from '@/lib/models/User';

const INVALID_REFRESH_TOKEN_DEFAULT_VALUE = 'INVALID_REFRESH_TOKEN';
const INVALID_ACCESS_TOKEN_DEFAULT_VALUE = 'INVALID_ACCESS_TOKEN';

export function withAuthenticationRedirect<T>(
  props: withAuthenticationRedirectProps<T>
): GetServerSideProps<T & { user: User | undefined; accessToken: string | undefined }> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<
    GetServerSidePropsResult<T & { user: User | undefined; accessToken: string | undefined }>
  > => {
    const refreshToken: string =
      context.req.cookies?.[WalterBackend.REFRESH_TOKEN_KEY] || INVALID_REFRESH_TOKEN_DEFAULT_VALUE;
    let accessToken: string =
      context.req.cookies?.[WalterBackend.ACCESS_TOKEN_KEY] || INVALID_ACCESS_TOKEN_DEFAULT_VALUE;

    // attempt to get user from backend via tokens (if present)
    let user: User | undefined = undefined;
    let getUser: GetUserResponse;

    if (accessToken !== INVALID_ACCESS_TOKEN_DEFAULT_VALUE) {
      getUser = await WalterBackend.getUser(accessToken);
      console.log(getUser);

      if (getUser.isNotAuthorized() && refreshToken !== INVALID_REFRESH_TOKEN_DEFAULT_VALUE) {
        const refresh: RefreshResponse = await WalterBackend.refresh(refreshToken);

        if (refresh.isSuccess()) {
          accessToken = refresh.getAccessToken();

          context.res.setHeader(
            'Set-Cookie',
            serialize(WalterBackend.ACCESS_TOKEN_KEY, accessToken, {
              httpOnly: true,
              path: '/',
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60, // match backend expiration
            })
          );

          getUser = await WalterBackend.getUser(accessToken);

          if (getUser.isSuccess()) {
            user = getUser.getUser();
          }
        }
      } else if (getUser.isSuccess()) {
        user = getUser.getUser();
      }
    }

    // Get additional props from optional SSR function
    const originalProps: { props: T } = props.getServerSidePropsFunc
      ? ((await props.getServerSidePropsFunc(context)) as { props: T })
      : { props: {} as T };

    // Redirect logic based on authentication
    if (!props.authenticatedPage && user) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    } else if (props.authenticatedPage && !user) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          ...originalProps.props,
          user: user || null,
          accessToken, // always return the valid access token (original or refreshed)
        },
      } as GetServerSidePropsResult<T & { user: User; accessToken: string }>;
    }
  };
}

export interface withAuthenticationRedirectProps<T> {
  authenticatedPage: boolean;
  getServerSidePropsFunc?: GetServerSideProps<T & { user: User | undefined }>;
}
