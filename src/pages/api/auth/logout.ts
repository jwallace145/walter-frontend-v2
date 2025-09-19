import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';
import cookie from 'cookie';

import { WalterBackend } from '@/lib/backend/client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const requestCookies: Record<string, string | undefined> = cookie.parse(
    request.headers.cookie || ''
  );
  const token: string | undefined = requestCookies[WalterBackend.ACCESS_TOKEN_KEY];

  if (!token) {
    return response.status(401).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.logout(token);

    const responseCookies: string[] | undefined = backendResponse.headers['set-cookie'];
    if (responseCookies) {
      response.setHeader('Set-Cookie', responseCookies);
    }

    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Logout failed:', err);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
