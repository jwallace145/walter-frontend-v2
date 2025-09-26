import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

const API_NAME: string = 'SyncTransactions';

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

  const { userId, accountId } = request.body;

  if (!userId || !accountId) {
    console.error(
      `${API_NAME} API proxy request is missing required fields. Not calling backend ${API_NAME} API.`
    );
    return response.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing required fields' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.syncTransactions(
      apiUrl,
      apiKey,
      accessToken,
      userId,
      accountId
    );

    if (backendResponse.status === HttpStatus.UNAUTHORIZED) {
      const cookies: string[] = await WalterBackend.refreshCookies(apiUrl, apiKey, refreshToken);
      response.setHeader('Set-Cookie', cookies);
      const newAccessToken: string = WalterBackend.getAccessTokenFromCookies(cookies);
      const backendRetryResponse: AxiosResponse = await WalterBackend.syncTransactions(
        apiUrl,
        apiKey,
        newAccessToken,
        userId,
        accountId
      );
      return response.status(backendRetryResponse.status).json(backendRetryResponse.data);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error(`Unexpected error occurred calling the ${API_NAME} API proxy:`, err);
    return response.status(500).json({ error: 'Internal Server Error (Proxy)' });
  }
}
