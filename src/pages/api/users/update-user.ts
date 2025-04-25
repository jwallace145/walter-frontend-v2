import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    response.status(200).json(await WalterAPI.updateUser(request));
  } catch (error) {
    console.error('Error while updating user:', error);
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
