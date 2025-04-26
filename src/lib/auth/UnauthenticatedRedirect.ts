import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { User } from '@/lib/models/User';

/**
 * This method redirects authenticated users attempting to access
 * unauthenticated pages like /signin, /landing, or /registration
 * to their dashboard.
 *
 * @param getServerSidePropsFunc The method used to get server side props.
 */
export function withUnauthenticatedRedirect<T extends Record<string, string>>(
  getServerSidePropsFunc?: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const token: string = context.req.cookies?.[WALTER_API_TOKEN_NAME] || '';

    // if user has token set attempt to get user from backend
    if (token) {
      const user: User = await WalterAPI.getUser(token);
      if (user) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false,
          },
        };
      }
    }

    const originalProps = getServerSidePropsFunc
      ? ((await getServerSidePropsFunc(context)) as { props: T })
      : { props: {} as T };

    return originalProps;
  };
}
