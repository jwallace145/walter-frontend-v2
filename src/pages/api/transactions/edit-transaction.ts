import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/api/WalterAPI';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const token: string = request.cookies.WALTER_API_TOKEN || '';
    response
      .status(200)
      .json(
        await WalterAPI.editTransaction(
          token,
          request.body.transaction_date,
          request.body.transaction_id,
          request.body.updated_date,
          request.body.updated_vendor,
          request.body.updated_amount,
          request.body.updated_category
        )
      );
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
