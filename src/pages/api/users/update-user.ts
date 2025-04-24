import type { NextApiRequest, NextApiResponse } from 'next';
import type { IncomingMessage } from 'http';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import axios, { AxiosResponse } from 'axios';
import { WALTER_API_ENDPOINT } from '@/pages/api/Constants';

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: IncomingMessage): Promise<{ fields: any; files: any }> => {
  const form = new IncomingForm({
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

async function updateUser(req: IncomingMessage, token: string) {
  const { fields, files } = await parseForm(req);

  // Log the files object to see its structure
  console.log(files.profile_picture);

  const formData = new FormData();

  // Check for the presence of profile_picture and handle it
  const profilePicture = files?.profile_picture;
  if (profilePicture && Array.isArray(profilePicture)) {
    // In case of multiple files uploaded with the same name, we handle it as an array
    profilePicture.forEach((file) => {
      formData.append('profile_picture', fs.createReadStream(file.filepath), {
        filename: file.originalFilename,
        contentType: file.mimetype || 'application/octet-stream',
      });
    });
  } else if (profilePicture && profilePicture.filepath) {
    // Handle a single file uploaded
    formData.append('profile_picture', fs.createReadStream(profilePicture.filepath), {
      filename: profilePicture.originalFilename,
      contentType: profilePicture.mimetype || 'application/octet-stream',
    });
  } else {
    throw new Error('Profile picture is required.');
  }

  const response: AxiosResponse = await axios({
    method: 'PUT',
    url: `${WALTER_API_ENDPOINT}/users`,
    headers: {
      Authorization: `Bearer ${token}`,
      ...formData.getHeaders(),
    },
    data: formData,
  });

  return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const token = req.cookies?.WALTER_API_TOKEN || '';
    const data = await updateUser(req, token);
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error while updating user:', error);
    const status = (error as any).response?.status || 500;
    const message = (error as any).response?.data || 'Internal Server Error';
    res.status(status).json({ message });
  }
}
