import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

const API_NAME: string = 'GetTransactions';

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
      `${API_NAME} API proxy request is missing access token or refresh token. Not calling backend ${API_NAME} API.`
    );
    return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.getTransactions(accessToken);

    if (backendResponse.status === HttpStatus.UNAUTHORIZED) {
      const cookies: string[] = await WalterBackend.refreshCookies(refreshToken);
      response.setHeader('Set-Cookie', cookies);
      const newAccessToken: string = WalterBackend.getAccessTokenFromCookies(cookies);
      const backendRetryResponse: AxiosResponse =
        await WalterBackend.getTransactions(newAccessToken);
      return response.status(backendRetryResponse.status).json(backendRetryResponse.data);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error(`Unexpected error occurred calling the ${API_NAME} API proxy:`, err);
    return response.status(500).json({ error: 'Internal Server Error (Proxy)' });
  }
}
