import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';
import { HttpStatus } from '@/lib/proxy/statuses';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  if (request.method !== 'POST') {
    return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({ error: 'Method not allowed' });
  }

  const { email, firstName, lastName, password } = request.body;

  if (!email || !firstName || !lastName || !password) {
    return response.status(HttpStatus.BAD_REQUEST).json({ error: 'Missing required fields' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.createUser(
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
