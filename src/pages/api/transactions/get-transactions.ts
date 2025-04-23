import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function getTransactions(request: NextApiRequest) {
  const token: string = request.cookies?.WALTER_API_TOKEN || '';
  const response: AxiosResponse = await axios({
    method: 'GET',
    url: `${WALTER_API_ENDPOINT}/expenses`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      start_date: request.query.start_date,
      end_date: request.query.end_date,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await getTransactions(request));
}
