import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const { email, firstName, lastName, password } = request.body;
  console.log(request.body);
  return response
    .status(200)
    .json(await WalterAPI.createUser(email, firstName, lastName, password));
}
