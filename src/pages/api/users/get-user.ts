import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function getUser() {
  const response: AxiosResponse = await axios({
    method: 'GET',
    url: `${WALTER_API_ENDPOINT}/users`, // Assuming this endpoint retrieves user details
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const data = await getUser();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error while fetching user:', error);
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    res.status(status).json({ message });
  }
}
