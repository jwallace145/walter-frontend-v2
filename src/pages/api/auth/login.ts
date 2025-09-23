import type { NextApiRequest, NextApiResponse } from 'next';
import { AxiosResponse } from 'axios';

import { WalterBackend } from '@/lib/backend/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const method: string | undefined = req.method;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  try {
    const backendResponse: AxiosResponse = await WalterBackend.login(email, password);

    const cookies: string[] | undefined = backendResponse.headers['set-cookie'];
    if (cookies) {
      res.setHeader('Set-Cookie', cookies);
    }

    return res.status(backendResponse.status).json(backendResponse.data);
  } catch (err) {
    console.error('Login failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
