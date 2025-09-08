import type { NextApiRequest, NextApiResponse } from 'next';

import { WalterBackend } from '@/lib/backend/Client';
import { CreateUserResponse } from '@/lib/backend/CreateUserResponse';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> {
  const { email, firstName, lastName, password } = request.body;
  try {
    const createUserResponse: CreateUserResponse = await WalterBackend.createUser(
      email,
      firstName,
      lastName,
      password
    );
    return response.status(200).json(createUserResponse);
  } catch (error) {
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    response.status(status).json({ message });
  }
}
