import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function deleteTransaction(request: NextApiRequest) {
  const token: string = request.cookies?.WALTER_API_TOKEN || '';
  const response: AxiosResponse = await axios({
    method: 'DELETE',
    url: `${WALTER_API_ENDPOINT}/expenses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      date: request.body.date,
      expense_id: request.body.expense_id,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await deleteTransaction(request));
}
