import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { AxiosResponse } from 'axios';
import { parse } from 'cookie';

import { WalterBackend } from '@/lib/backend/client';
import { GetUserResponse } from '@/lib/backend/responses';
import { User } from '@/lib/models/User';

const INVALID_REFRESH_TOKEN_DEFAULT_VALUE = 'INVALID_REFRESH_TOKEN';
const INVALID_ACCESS_TOKEN_DEFAULT_VALUE = 'INVALID_ACCESS_TOKEN';

export function withAuthenticationRedirect<T>(
  props: withAuthenticationRedirectProps<T>
): GetServerSideProps<T & { user: User | null; accessToken: string | undefined }> {
  return async (
    context: GetServerSidePropsContext
  ): Promise<
    GetServerSidePropsResult<T & { user: User | null; accessToken: string | undefined }>
  > => {
    const refreshToken: string =
      context.req.cookies?.[WalterBackend.REFRESH_TOKEN_KEY] || INVALID_REFRESH_TOKEN_DEFAULT_VALUE;
    let accessToken: string =
      context.req.cookies?.[WalterBackend.ACCESS_TOKEN_KEY] || INVALID_ACCESS_TOKEN_DEFAULT_VALUE;

    let user: User | null = null;

    if (accessToken !== INVALID_ACCESS_TOKEN_DEFAULT_VALUE) {
      let getUser: AxiosResponse = await WalterBackend.getUser(accessToken);

      // If access token is invalid/expired, try refreshing
      if (getUser.status === 401 && refreshToken !== INVALID_REFRESH_TOKEN_DEFAULT_VALUE) {
        const refresh: AxiosResponse = await WalterBackend.refresh(refreshToken);

        if (refresh.status === 200 && refresh.headers['set-cookie']) {
          const setCookies: string[] = Array.isArray(refresh.headers['set-cookie'])
            ? refresh.headers['set-cookie']
            : [refresh.headers['set-cookie']];

          // Forward the Set-Cookie headers to the browser so cookies are updated
          context.res.setHeader('Set-Cookie', setCookies);

          // Extract the access token from the refreshed cookies for SSR use
          for (const c of setCookies) {
            const parsed: Record<string, string | undefined> = parse(c);
            if (parsed[WalterBackend.ACCESS_TOKEN_KEY]) {
              accessToken = parsed[WalterBackend.ACCESS_TOKEN_KEY] as string;
              break;
            }
          }

          // Retry fetching the user with new access token
          if (accessToken && accessToken !== INVALID_ACCESS_TOKEN_DEFAULT_VALUE) {
            getUser = await WalterBackend.getUser(accessToken);
            if (getUser.status === 200) {
              user = new GetUserResponse({
                statusCode: getUser.status,
                service: getUser.data['Service'],
                domain: getUser.data['Domain'],
                api: getUser.data['API'],
                requestId: getUser.data['RequestId'],
                status: getUser.data['Status'],
                message: getUser.data['Message'],
                responseTimeMillis: getUser.data['ResponseTimeMillis'],
                data: getUser.data['Data'] || undefined,
              }).getUser();
            }
          }
        }
      } else if (getUser.status === 200) {
        user = new GetUserResponse({
          statusCode: getUser.status,
          service: getUser.data['Service'],
          domain: getUser.data['Domain'],
          api: getUser.data['API'],
          requestId: getUser.data['RequestId'],
          status: getUser.data['Status'],
          message: getUser.data['Message'],
          responseTimeMillis: getUser.data['ResponseTimeMillis'],
          data: getUser.data['Data'] || undefined,
        }).getUser();
      }
    }

    // Run the optional SSR function provided by the page
    const originalProps: { props: T } = props.getServerSidePropsFunc
      ? ((await props.getServerSidePropsFunc(context)) as { props: T })
      : { props: {} as T };

    // Redirect logic
    if (!props.authenticatedPage && user) {
      return { redirect: { destination: '/dashboard', permanent: false } };
    }
    if (props.authenticatedPage && !user) {
      return { redirect: { destination: '/signin', permanent: false } };
    }

    // Return props (include latest valid access token)
    return {
      props: {
        ...originalProps.props,
        user,
        accessToken,
      },
    };
  };
}

export interface withAuthenticationRedirectProps<T> {
  authenticatedPage: boolean;
  getServerSidePropsFunc?: GetServerSideProps<T & { user: User | null }>;
}
