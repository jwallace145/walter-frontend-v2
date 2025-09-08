import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterBackend } from '@/lib/backend/Client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const token: string = request.cookies[WalterBackend.ACCESS_TOKEN_KEY] || '';
  response.status(200).json(await WalterBackend.createLinkToken(token));
}
