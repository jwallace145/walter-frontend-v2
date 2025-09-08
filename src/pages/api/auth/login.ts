import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterBackend } from '@/lib/backend/Client';
import { LoginResponse } from '@/lib/backend/Login';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const { email, password } = request.body;
  const loginResponse: LoginResponse = await WalterBackend.login(email, password);
  return response.status(loginResponse.statusCode).json(loginResponse);
}
