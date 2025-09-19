import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { WalterBackendProxy } from '@/lib/proxy/client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const token: string | undefined = request.cookies[WalterBackendProxy.ACCESS_TOKEN_KEY];

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
