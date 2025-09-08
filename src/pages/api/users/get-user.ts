import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterBackend } from '@/lib/backend/Client';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const token: string = request.cookies[WalterBackend.ACCESS_TOKEN_KEY] || '';
    response.status(200).json(await WalterBackend.getUser(token));
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
