import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';
import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const token: string = request.cookies[WALTER_API_TOKEN_NAME] || '';
  response
    .status(200)
    .json(
      await WalterAPI.createCashAccount(
        token,
        request.body.bankName,
        request.body.accountName,
        request.body.accountType,
        request.body.accountLastFourNumbers,
        request.body.balance
      )
    );
}
