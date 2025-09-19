import axios, { AxiosResponse } from 'axios';

import { ENDPOINTS } from '@/lib/backend/endpoints';

/****************************
 * WalterBackend API Client *
 ****************************/

export class WalterBackend {
  static readonly API_URL: string = process.env.NEXT_PUBLIC_WALTER_API_ENDPOINT as string;
  static readonly REFRESH_TOKEN_KEY: string = 'WALTER_BACKEND_REFRESH_TOKEN';
  static readonly ACCESS_TOKEN_KEY: string = 'WALTER_BACKEND_ACCESS_TOKEN';

  public static async login(email: string, password: string): Promise<AxiosResponse> {
    return this.callBackend(ENDPOINTS['LOGIN'].method, ENDPOINTS['LOGIN'].path, undefined, {
      email,
      password,
    });
  }

  public static async logout(token: string): Promise<AxiosResponse> {
    return this.callBackend(ENDPOINTS['LOGOUT'].method, ENDPOINTS['LOGOUT'].path, token);
  }

  public static async refresh(token: string): Promise<AxiosResponse> {
    return this.callBackend(ENDPOINTS['REFRESH'].method, ENDPOINTS['REFRESH'].path, token);
  }

  public static async getUser(token: string): Promise<AxiosResponse> {
    return this.callBackend(ENDPOINTS['GET_USER'].method, ENDPOINTS['GET_USER'].path, token);
  }

  public static async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<AxiosResponse> {
    return this.callBackend(
      ENDPOINTS['CREATE_USER'].method,
      `${this.API_URL}${ENDPOINTS['CREATE_USER'].path}`,
      undefined,
      {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      }
    );
  }

  public static async createLinkToken(token: string): Promise<AxiosResponse> {
    return this.callBackend(
      ENDPOINTS['CREATE_LINK_TOKEN'].method,
      ENDPOINTS['CREATE_LINK_TOKEN'].path,
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
      ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].method,
      ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].path,
      token,
      {
        public_token: publicToken,
        institution_id: institutionId,
        institution_name: institutionName,
        accounts: accounts,
      }
    );
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
