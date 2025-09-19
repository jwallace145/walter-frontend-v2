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

  const cookies: Record<string, string | undefined> = cookie.parse(request.headers.cookie || '');
  const token: string | undefined = cookies[WalterBackend.ACCESS_TOKEN_KEY];

  if (!token) {
    return response.status(401).json({ error: 'Missing access token' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.exchangePublicToken(
      token,
      request.body.public_token,
      request.body.institution_id,
      request.body.institution_name,
      request.body.accounts
    );
    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Exchange Public Token failed:', err);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
