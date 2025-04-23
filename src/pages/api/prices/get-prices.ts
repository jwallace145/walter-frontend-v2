import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function getPrices(request: NextApiRequest) {
  const { stock, start_date, end_date } = request.query;
  const response: AxiosResponse = await axios({
    method: 'GET',
    url: `${WALTER_API_ENDPOINT}/prices`,
    params: {
      stock: stock,
      start_date: start_date,
      end_date: end_date,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await getPrices(request));
}
