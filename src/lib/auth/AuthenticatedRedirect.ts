import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { User } from '@/lib/models/User';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

export function withAuthenticatedRedirect<T>(
  getServerSidePropsFunc?: GetServerSideProps<T & { user: User }>
): GetServerSideProps<T & { user: User }> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T & { user: User }>> => {
    const token: string | undefined = context.req.cookies?.WALTER_API_TOKEN;

    if (!token) {
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }

    try {
      const response: Response = await fetch(`${WALTER_API_ENDPOINT}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const json = await response.json();

      if (!json?.Data) {
        throw new Error('Invalid user response');
      }

      const user: User = json.Data;

      const originalProps = getServerSidePropsFunc
        ? await getServerSidePropsFunc(context)
        : { props: {} as T };

      if ('props' in originalProps) {
        return {
          props: {
            ...originalProps.props,
            user,
          },
        } as GetServerSidePropsResult<T & { user: User }>;
      }

      return originalProps;
    } catch (err) {
      console.error('Auth error:', err);
      return {
        redirect: {
          destination: '/signin',
          permanent: false,
        },
      };
    }
  };
}
