import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

const API_NAME: string = 'Logout';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const apiUrl: string | undefined = process.env.WALTER_BACKEND_API_URL;
  const apiKey: string | undefined = process.env.WALTER_BACKEND_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error(
      `WalterBackend API URL or API key is missing in ${API_NAME} API proxy request. Not calling WalterBackend.`
    );
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken: string | undefined = WalterBackend.getAccessToken(request);
  const refreshToken: string | undefined = WalterBackend.getRefreshToken(request);

  if (!accessToken || !refreshToken) {
    console.error(
      'Logout API proxy request is missing access token or refresh token. Not calling backend API.'
    );
    return response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.logout(apiUrl, apiKey, accessToken);

    if (backendResponse.status === HttpStatus.UNAUTHORIZED) {
      const cookies: string[] = await WalterBackend.refreshCookies(apiUrl, apiKey, refreshToken);
      response.setHeader('Set-Cookie', cookies);
      const newAccessToken: string = WalterBackend.getAccessTokenFromCookies(cookies);
      const backendRetryResponse: AxiosResponse = await WalterBackend.logout(
        apiUrl,
        apiKey,
        newAccessToken
      );
      const retryResponseCookies: string[] | undefined = backendRetryResponse.headers['set-cookie'];
      if (retryResponseCookies) {
        response.setHeader('Set-Cookie', retryResponseCookies);
      }
      return response.status(backendRetryResponse.status).json(backendRetryResponse.data);
    }

    const responseCookies: string[] | undefined = backendResponse.headers['set-cookie'];
    if (responseCookies) {
      response.setHeader('Set-Cookie', responseCookies);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Unexpected error occurred calling the Logout proxy endpoint:', err);
    return response.status(500).json({ error: 'Internal Server Error from Next.js API' });
  }
}
