import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  if (request.method !== 'GET') {
    return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }

  const accessToken: string | undefined = WalterBackend.getAccessToken(request);
  const refreshToken: string | undefined = WalterBackend.getRefreshToken(request);

  if (!accessToken || !refreshToken) {
    console.error(
      'GetAccounts API proxy request is missing access token or refresh token. Not calling backend API.'
    );
    return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.getAccounts(accessToken);

    if (backendResponse.status === HttpStatus.UNAUTHORIZED) {
      const cookies: string[] = await WalterBackend.refreshCookies(refreshToken);
      response.setHeader('Set-Cookie', cookies);
      const newAccessToken: string = WalterBackend.getAccessTokenFromCookies(cookies);
      const backendRetryResponse: AxiosResponse = await WalterBackend.getAccounts(newAccessToken);
      return response.status(backendRetryResponse.status).json(backendRetryResponse.data);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Unexpected error occurred calling the GetAccounts proxy endpoint:', err);
    return response.status(500).json({ error: 'Internal Server Error from Next.js API' });
  }
}
