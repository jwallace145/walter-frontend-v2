import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';
import cookie from 'cookie';

import { WalterBackend } from '@/lib/backend/client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const cookies: Record<string, string | undefined> = cookie.parse(request.headers.cookie || '');
  const token: string | undefined = cookies[WalterBackend.ACCESS_TOKEN_KEY];

  if (!token) {
    return response.status(401).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.createLinkToken(token);
    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Create Plaid Link Token failed:', err);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
