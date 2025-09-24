import { NextApiRequest } from 'next';
import axios, { AxiosResponse } from 'axios';

import { API_ENDPOINTS } from '@/lib/backend/endpoints';
import { HttpStatus } from '@/lib/proxy/statuses';

/****************************
 * WalterBackend API Client *
 ****************************/

export class WalterBackend {
  static readonly API_URL: string = process.env.WALTER_BACKEND_API_URL as string;

  static readonly REFRESH_TOKEN_KEY: string = 'WALTER_BACKEND_REFRESH_TOKEN';
  static readonly ACCESS_TOKEN_KEY: string = 'WALTER_BACKEND_ACCESS_TOKEN';

  public static async login(email: string, password: string): Promise<AxiosResponse> {
    return this.callBackend(API_ENDPOINTS['LOGIN'].method, API_ENDPOINTS['LOGIN'].path, undefined, {
      email,
      password,
    });
  }

  public static async logout(token: string): Promise<AxiosResponse> {
    return this.callBackend(API_ENDPOINTS['LOGOUT'].method, API_ENDPOINTS['LOGOUT'].path, token);
  }

  public static async refresh(token: string): Promise<AxiosResponse> {
    return this.callBackend(API_ENDPOINTS['REFRESH'].method, API_ENDPOINTS['REFRESH'].path, token);
  }

  public static async getUser(token: string): Promise<AxiosResponse> {
    return this.callBackend(
      API_ENDPOINTS['GET_USER'].method,
      API_ENDPOINTS['GET_USER'].path,
      token
    );
  }

  public static async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      API_ENDPOINTS['CREATE_USER'].method,
      `${this.API_URL}${API_ENDPOINTS['CREATE_USER'].path}`,
      undefined,
      {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }
    );
  }

  public static async getAccounts(token: string): Promise<AxiosResponse> {
    return this.callBackend(
      API_ENDPOINTS['GET_ACCOUNTS'].method,
      API_ENDPOINTS['GET_ACCOUNTS'].path,
      token
    );
  }

  public static async createLinkToken(token: string): Promise<AxiosResponse> {
    return this.callBackend(
      API_ENDPOINTS['CREATE_LINK_TOKEN'].method,
      API_ENDPOINTS['CREATE_LINK_TOKEN'].path,
      token
    );
  }

  public static async exchangePublicToken(
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

  public static async refreshCookies(refreshToken: string): Promise<string[]> {
    const refreshResponse: AxiosResponse = await WalterBackend.refresh(refreshToken);

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
    method: string,
    path: string,
    token?: string,
    data?: any
  ): Promise<AxiosResponse> {
    const config: any = {
      method: method,
      url: `${this.API_URL}${path}`,
      validateStatus: function (status: number): boolean {
        return true;
      },
    };

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    if (data) {
      config.data = data;
    }

    return axios(config);
  }
}
