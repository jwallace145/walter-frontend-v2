import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { User } from '@/lib/models/User';

/**
 * This method redirects unauthenticated users attempting to access
 * authenticated pages.
 *
 * @param getServerSidePropsFunc The method used to get server side props.
 */
export function withAuthenticatedRedirect<T>(
  getServerSidePropsFunc?: GetServerSideProps<T & { user: User }>
): GetServerSideProps<T & { user: User }> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T & { user: User }>> => {
    const token: string | undefined = context.req.cookies?.[WALTER_API_TOKEN_NAME] || '';

    // if token is not set, redirect unauthenticated user to sign in
    if (!token) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }

    // attempt to get user with token to allow for authenticated access
    const user: User = await WalterAPI.getUser(token);

    // get original props from passed in function
    const originalProps = getServerSidePropsFunc
      ? ((await getServerSidePropsFunc(context)) as { props: T })
      : { props: {} as T };

    // return merged original props and user to the authenticated page
    return {
      props: {
        ...originalProps.props,
        user,
      },
    } as GetServerSidePropsResult<T & { user: User }>;
  };
}
