import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

async function authenticateUser(request: NextApiRequest) {
  const response: AxiosResponse = await axios({
    method: 'POST',
    url: `${WALTER_API_ENDPOINT}/auth`,
    data: {
      email: request.body.email,
      password: request.body.password,
    },
  });
  return response.data;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  response.status(200).json(await authenticateUser(request));
}
