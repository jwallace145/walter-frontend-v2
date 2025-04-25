import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const token: string = request.cookies.WALTER_API_TOKEN || '';
  response.status(200).json(await WalterAPI.getPortfolio(token));
}
