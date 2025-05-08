import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { User } from '@/lib/models/User';

/**
 * This SSR function gets the current user from WalterAPI and redirects users based on authentication status.
 *
 * This method is an SSR function that calls the GetUser API in an attempt to get the current user before
 * allowing access to authenticated pages. Furthermore, this method redirects authenticated users attempting
 * to access unauthenticated pages. This method is intended to be used by all pages to protect authenticated
 * access. Pages can pass in an additional SSR function to get additional props from the server as well
 * before rendering.
 *
 * @param props
 */
export function withAuthenticationRedirect<T>(
  props: withAuthenticationRedirectProps<T>
): GetServerSideProps<T & { user: User | undefined }> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T & { user: User | undefined }>> => {
    // grab user api token from cookies if it exists and attempt to get user from backend
    const token: string = context.req.cookies?.[WALTER_API_TOKEN_NAME] || 'INVALID_TOKEN';
    const user: User | null = await WalterAPI.getUser(token);

    // get original props from passed in optional ssr function
    const originalProps: { props: T } = props.getServerSidePropsFunc
      ? ((await props.getServerSidePropsFunc(context)) as { props: T })
      : { props: {} as T };

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
          user,
        },
      } as GetServerSidePropsResult<T & { user: User }>;
    }
  };
}

export interface withAuthenticationRedirectProps<T> {
  authenticatedPage: boolean;
  getServerSidePropsFunc?: GetServerSideProps<T & { user: User | undefined }>;
}
