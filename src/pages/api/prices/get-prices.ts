import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response
    .status(200)
    .json(
      await WalterAPI.getPrices(
        request.query.stock as string,
        request.query.start_date as string,
        request.query.end_date as string
      )
    );
}
