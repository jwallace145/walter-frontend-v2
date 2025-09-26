import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

const API_NAME: string = 'CreateUser';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const apiUrl: string | undefined = process.env.WALTER_BACKEND_API_URL;
  const apiKey: string | undefined = process.env.WALTER_BACKEND_API_KEY;

  if (!apiUrl || !apiKey) {
    console.error(
      `WalterBackend API URL or API key is missing in ${API_NAME} API proxy request. Not calling WalterBackend.`
    );
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }

  if (request.method !== 'POST') {
    return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName, password } = request.body;

  if (!email || !firstName || !lastName || !password) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing required fields' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.createUser(
      apiUrl,
      apiKey,
      email,
      firstName,
      lastName,
      password
    );
    return response.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Create User failed:', err);
    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal Server Error' });
  }
}
