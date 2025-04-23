import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function editTransaction(request: NextApiRequest) {
  const token: string = request.cookies?.WALTER_API_TOKEN || '';
  const response: AxiosResponse = await axios({
    method: 'PUT',
    url: `${WALTER_API_ENDPOINT}/expenses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      date: request.body.date,
      expense_id: request.body.expense_id,
      vendor: request.body.vendor,
      amount: request.body.amount,
      category: request.body.category,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const data = await editTransaction(request);
    response.status(200).json(data);
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
