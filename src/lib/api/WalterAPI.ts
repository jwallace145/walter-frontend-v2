import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { IncomingMessage } from 'http';
import { getCookie } from 'typescript-cookie';

import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { Expense } from '@/lib/models/Expense';
import { Portfolio } from '@/lib/models/Portfolio';
import { Price } from '@/lib/models/Price';
import { User } from '@/lib/models/User';

/**
 * WalterAPI
 *
 * This class contains methods to call all APIs included in WalterAPI. The
 * Next.js API routes use this class to route API requests to WalterBackend.
 */
export class WalterAPI {
  static readonly ENDPOINT: string = process.env.NEXT_PUBLIC_WALTER_API_ENDPOINT as string;

  public static async authUser(email: string, password: string): Promise<any> {
    return axios({
      method: 'POST',
      url: `${WalterAPI.ENDPOINT}/auth`,
      data: {
        email: email,
        password: password,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async getUser(token: string): Promise<User | null> {
    return await axios({
      method: 'GET',
      url: `${this.ENDPOINT}/users`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response: AxiosResponse): User | null => response.data.Data ?? null);
  }

  public static async updateUser(request: IncomingMessage): Promise<any> {
    const token: string = request.headers.authorization?.split(' ')[1] || '';
    const { fields, files } = await this.parseForm(request);
    console.log(fields);
    const formData = new FormData();
    const profilePicture = files?.profile_picture;
    if (profilePicture && Array.isArray(profilePicture)) {
      profilePicture.forEach((file): void => {
        formData.append('profile_picture', fs.createReadStream(file.filepath), {
          filename: file.originalFilename,
          contentType: file.mimetype,
        });
      });
    } else {
      throw new Error('Profile picture is required!');
    }
    return await axios({
      method: 'PUT',
      url: `${this.ENDPOINT}/users`,
      headers: {
        Authorization: `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      data: formData,
    }).then((response: AxiosResponse) => response.data);
  }

  public static async getPortfolio(token: string): Promise<Portfolio> {
    return axios({
      method: 'GET',
      url: `${this.ENDPOINT}/portfolios`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response: AxiosResponse) => response.data.Data);
  }

  public static async getPrices(
    stock: string,
    startDate: string,
    endDate: string
  ): Promise<Price[]> {
    return axios({
      method: 'GET',
      url: `${this.ENDPOINT}/prices`,
      params: {
        stock: stock,
        start_date: startDate,
        end_date: endDate,
      },
    }).then((response: AxiosResponse) => response.data.Data.prices);
  }

  public static async getTransactions(
    token: string,
    startDate: string,
    endDate: string
  ): Promise<Expense[]> {
    return axios({
      method: 'GET',
      url: `${WalterAPI.ENDPOINT}/expenses`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async editTransaction(
    token: string,
    expense_id: string,
    date: string,
    vendor: string,
    amount: number,
    category: string
  ): Promise<any> {
    return axios({
      method: 'PUT',
      url: `${WalterAPI.ENDPOINT}/expenses`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        date: date,
        expense_id: expense_id,
        vendor: vendor,
        amount: amount,
        category: category,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async addTransaction(
    token: string,
    date: string,
    vendor: string,
    amount: number
  ): Promise<any> {
    return axios({
      method: 'POST',
      url: `${this.ENDPOINT}/expenses`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        date: date,
        vendor: vendor,
        amount: amount,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async deleteTransaction(
    token: string,
    expenseId: string,
    date: string
  ): Promise<void> {
    axios({
      method: 'DELETE',
      url: `${this.ENDPOINT}/expenses`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        date: date,
        expense_id: expenseId,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async addStock(token: string, stock: string, quantity: string): Promise<void> {
    axios({
      method: 'POST',
      url: `${this.ENDPOINT}/stocks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        stock: stock,
        quantity: quantity,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async deleteStock(token: string, stock: string): Promise<void> {
    axios({
      method: 'DELETE',
      url: `${this.ENDPOINT}/stocks`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        stock: stock,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  /**
   * Parses a multipart/form-data request, typically used for file uploads.
   *
   * This method is particularly useful in Next.js API routes when handling
   * file uploads, since Next.js default JSON body parser does not support
   * multipart/form-data requests.
   *
   * To use this method, you must disable the default JSON body parser in your
   * API route:
   *
   * ```ts
   * export const config = {
   *   api: {
   *     bodyParser: false,
   *   },
   * };
   * ```
   *
   * @param request - The incoming HTTP request object
   * @returns A promise that resolves to an object containing `fields` and `files`
   */
  private static parseForm(request: IncomingMessage): Promise<{ fields: any; files: any }> {
    const form = new IncomingForm({ keepExtensions: true });

    return new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files): void => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
  }

  /**
   * Get the WalterAPI authentication token from user cookies.
   *
   * In the scenario the token is not set, this method returns an
   * empty string which will inevitably fail any authenticated
   * requests.
   */
  public static getToken(): string {
    return getCookie(WALTER_API_TOKEN_NAME) || '';
  }
}
