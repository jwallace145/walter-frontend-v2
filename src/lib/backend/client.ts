import axios, { AxiosResponse } from 'axios';

import { API_ENDPOINTS } from '@/lib/backend/endpoints';

/****************************
 * WalterBackend API Client *
 ****************************/

export class WalterBackend {
  static readonly API_URL: string = process.env.NEXT_PUBLIC_WALTER_API_ENDPOINT as string;

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
