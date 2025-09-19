import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { WalterBackendProxy } from '@/lib/proxy/client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token: string | undefined = request.cookies[WalterBackendProxy.ACCESS_TOKEN_KEY];

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
    console.log('Dude straight up, what is happening');
    console.error('Logout failed:', err);
    return response.status(500).json({ error: 'Internal Server Error from Next.js API' });
  }
}
