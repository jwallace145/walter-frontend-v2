import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function deleteStock(request: NextApiRequest) {
  const token: string = request.cookies?.WALTER_API_TOKEN || '';
  const response: AxiosResponse = await axios({
    method: 'DELETE',
    url: `${WALTER_API_ENDPOINT}/stocks`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      stock: request.body.stock,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  try {
    const data = await deleteStock(request);
    response.status(200).json(data);
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
