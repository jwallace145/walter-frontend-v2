import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterAPI } from '@/lib/backend/Client';
import { PortfolioStock } from '@/lib/models/PortfolioStock';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const token: string = request.cookies.WALTER_API_TOKEN || '';
    const stock: PortfolioStock = await WalterAPI.addStock(
      token,
      request.body.stock,
      request.body.quantity
    );
    response.status(200).json(stock);
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
