import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function addTransaction(request: NextApiRequest) {
  const token: string = request.cookies?.WALTER_API_TOKEN || '';
  const response: AxiosResponse = await axios({
    method: 'POST',
    url: `${WALTER_API_ENDPOINT}/expenses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      date: request.body.date,
      vendor: request.body.vendor,
      amount: request.body.amount,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await addTransaction(request));
}
