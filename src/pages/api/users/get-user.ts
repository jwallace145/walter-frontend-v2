import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const token: string = request.cookies.WALTER_API_TOKEN || '';
    response.status(200).json(await WalterAPI.getUser(token));
  } catch (error) {
    console.error('Error while fetching user:', error);
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
