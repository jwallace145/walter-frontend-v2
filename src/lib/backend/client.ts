import { NextApiRequest } from 'next';
import axios, { AxiosResponse } from 'axios';

import { API_ENDPOINTS } from '@/lib/backend/endpoints';
import { HttpStatus } from '@/lib/proxy/statuses';

/****************************
 * WalterBackend API Client *
 ****************************/

export class WalterBackend {
  static readonly REFRESH_TOKEN_KEY: string = 'WALTER_BACKEND_REFRESH_TOKEN';
  static readonly ACCESS_TOKEN_KEY: string = 'WALTER_BACKEND_ACCESS_TOKEN';

  public static async login(
    url: string,
    key: string,
    email: string,
    password: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['LOGIN'].method,
      API_ENDPOINTS['LOGIN'].path,
      undefined,
      {
        email,
        password,
      }
    );
  }

  public static async logout(url: string, key: string, token: string): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['LOGOUT'].method,
      API_ENDPOINTS['LOGOUT'].path,
      token
    );
  }

  public static async refresh(url: string, key: string, token: string): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['REFRESH'].method,
      API_ENDPOINTS['REFRESH'].path,
      token
    );
  }

  public static async getUser(url: string, key: string, token: string): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['GET_USER'].method,
      API_ENDPOINTS['GET_USER'].path,
      token
    );
  }

  public static async createUser(
    url: string,
    key: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['CREATE_USER'].method,
      API_ENDPOINTS['CREATE_USER'].path,
      undefined,
      {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }
    );
  }

  public static async getAccounts(url: string, key: string, token: string): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['GET_ACCOUNTS'].method,
      API_ENDPOINTS['GET_ACCOUNTS'].path,
      token
    );
  }

  public static async getTransactions(
    url: string,
    key: string,
    token: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['GET_TRANSACTIONS'].method,
      API_ENDPOINTS['GET_TRANSACTIONS'].path,
      token
    );
  }

  public static async createLinkToken(
    url: string,
    key: string,
    token: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['CREATE_LINK_TOKEN'].method,
      API_ENDPOINTS['CREATE_LINK_TOKEN'].path,
      token
    );
  }

  public static async exchangePublicToken(
    url: string,
    key: string,
    token: string,
    publicToken: string,
    institutionId: string,
    institutionName: string,
    accounts: {
      account_id: string;
      account_name: string;
      account_type: string;
      account_subtype: string;
      account_last_four_numbers: string;
    }[]
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].method,
      API_ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].path,
      token,
      {
        public_token: publicToken,
        institution_id: institutionId,
        institution_name: institutionName,
        accounts: accounts,
      }
    );
  }

  public static syncTransactions(
    url: string,
    key: string,
    token: string,
    userId: string,
    accountId: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      url,
      key,
      API_ENDPOINTS['SYNC_TRANSACTIONS'].method,
      API_ENDPOINTS['SYNC_TRANSACTIONS'].path,
      token,
      {
        user_id: userId,
        account_id: accountId,
      }
    );
  }

  public static async refreshCookies(
    url: string,
    key: string,
    refreshToken: string
  ): Promise<string[]> {
    const refreshResponse: AxiosResponse = await WalterBackend.refresh(url, key, refreshToken);

    if (refreshResponse.status === HttpStatus.OK) {
      const cookies: string[] | undefined = refreshResponse.headers['set-cookie'];

      if (cookies) {
        return cookies;
      }
    }

    throw new Error('Failed to refresh access token. Refresh response was not OK.');
  }

  public static getAccessTokenFromCookies(cookies: string[]): string {
    const cookie: string | undefined = cookies.find((cookie) =>
      cookie.startsWith(this.ACCESS_TOKEN_KEY)
    );
    if (!cookie)
      throw new Error('Failed to get access token from cookie. No access token cookie found.');
    const accessToken: string | undefined = cookie.split(';')[0].split('=')[1];
    if (!accessToken)
      throw new Error('Failed to get access token from cookie. Access token cookie was invalid.');
    return accessToken;
  }

  public static getAccessToken(request: NextApiRequest): string | undefined {
    return request.cookies[this.ACCESS_TOKEN_KEY];
  }

  public static getRefreshToken(request: NextApiRequest): string | undefined {
    return request.cookies[this.REFRESH_TOKEN_KEY];
  }

  private static async callBackend(
    url: string,
    key: string,
    method: string,
    path: string,
    token?: string,
    data?: any
  ): Promise<AxiosResponse> {
    const config: any = {
      method: method,
      url: `${url}${path}`,
      validateStatus: function (status: number): boolean {
        return true;
      },
    };

    const headers: Record<string, string> = {};
    headers['x-api-key'] = key;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    config.headers = headers;

    if (data) {
      config.data = data;
    }

    return axios(config);
  }
}
