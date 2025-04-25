import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { User } from '@/lib/models/User'; // Assume this is your GetUser function
import { WALTER_API_ENDPOINT, WALTER_API_TOKEN_NAME } from '@/pages/api/Constants';

export function withUnauthenticatedRedirect<T>(
  getServerSidePropsFunc?: GetServerSideProps<T>
): GetServerSideProps<T> {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<T>> => {
    const token: string = context.req.cookies?.[WALTER_API_TOKEN_NAME] || '';

    if (token) {
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

        if (user) {
          return {
            redirect: {
              destination: '/dashboard', // Redirect authenticated users to the dashboard
              permanent: false,
            },
          };
        }
      } catch (error) {
        console.error(error);
      }
    }

    const originalProps = getServerSidePropsFunc
      ? await getServerSidePropsFunc(context)
      : { props: {} as T };

    if ('props' in originalProps) {
      return {
        props: originalProps.props,
      };
    }

    return originalProps;
  };
}
