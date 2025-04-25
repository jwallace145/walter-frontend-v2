import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await WalterAPI.authUser(request.body.email, request.body.password));
}
