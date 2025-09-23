import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const accessToken: string | undefined = WalterBackend.getAccessToken(request);
  const refreshToken: string | undefined = WalterBackend.getRefreshToken(request);

  if (!accessToken || !refreshToken) {
    console.error(
      'CreateLinkToken API proxy request is missing access token or refresh token. Not calling backend API.'
    );
    return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.createLinkToken(accessToken);

    if (backendResponse.status === HttpStatus.UNAUTHORIZED) {
      const cookies: string[] = await WalterBackend.refreshCookies(refreshToken);
      response.setHeader('Set-Cookie', cookies);
      const newAccessToken: string = WalterBackend.getAccessTokenFromCookies(cookies);
      const backendRetryResponse: AxiosResponse =
        await WalterBackend.createLinkToken(newAccessToken);
      return response.status(backendRetryResponse.status).json(backendRetryResponse.data);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Unexpected error occurred handling CreateLinkToken API proxy request:', err);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
