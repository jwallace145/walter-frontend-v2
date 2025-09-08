import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/backend/Client';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const token: string = request.cookies[WALTER_API_TOKEN_NAME] || '';
  await WalterAPI.exchangePublicToken(
    token,
    request.body.public_token,
    request.body.institution_id,
    request.body.institution_name,
    request.body.accounts
  );
  response.status(200).json({
    success: true,
  });
}
