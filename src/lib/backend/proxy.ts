import axios, { AxiosResponse } from 'axios';

import { ENDPOINTS } from '@/lib/backend/endpoints';
import { ResponseArguments } from '@/lib/backend/response';
import {
  CreateLinkTokenData,
  CreateLinkTokenResponse,
  CreateUserData,
  CreateUserResponse,
  ExchangePublicTokenData,
  ExchangePublicTokenResponse,
  LoginData,
  LoginResponse,
  LogoutData,
  LogoutResponse,
} from '@/lib/backend/responses';

export class WalterBackendProxy {
  static readonly PROXY_URL: string = '/api';

  public static async login(email: string, password: string): Promise<LoginResponse> {
    return this.callProxy(ENDPOINTS['LOGIN'].method, ENDPOINTS['LOGIN'].proxy, {
      email,
      password,
    })
      .then(
        (response: AxiosResponse): ResponseArguments<LoginData> =>
          this.getResponseArgs<LoginData>(response)
      )
      .then((args: ResponseArguments<LoginData>): LoginResponse => new LoginResponse(args));
  }

  public static async logout(): Promise<LogoutResponse> {
    return this.callProxy(ENDPOINTS['LOGOUT'].method, ENDPOINTS['LOGOUT'].proxy)
      .then(
        (response: AxiosResponse): ResponseArguments<LogoutData> =>
          this.getResponseArgs<LogoutData>(response)
      )
      .then((args: ResponseArguments<LogoutData>): LogoutResponse => new LogoutResponse(args));
  }

  public static async createUser(): Promise<CreateUserResponse> {
    return this.callProxy(ENDPOINTS['CREATE_USER'].method, ENDPOINTS['CREATE_USER'].proxy)
      .then(
        (response: AxiosResponse): ResponseArguments<CreateUserData> =>
          this.getResponseArgs(response)
      )
      .then(
        (args: ResponseArguments<CreateUserData>): CreateUserResponse =>
          new CreateUserResponse(args)
      );
  }

  public static async createLinkToken(): Promise<CreateLinkTokenResponse> {
    return this.callProxy(
      ENDPOINTS['CREATE_LINK_TOKEN'].method,
      ENDPOINTS['CREATE_LINK_TOKEN'].proxy
    )
      .then(
        (response: AxiosResponse): ResponseArguments<CreateLinkTokenData> =>
          this.getResponseArgs<CreateLinkTokenData>(response)
      )
      .then(
        (args: ResponseArguments<CreateLinkTokenData>): CreateLinkTokenResponse =>
          new CreateLinkTokenResponse(args)
      );
  }

  public static async exchangePublicToken(
    publicToken: string,
    institutionId: string,
    institutionName: string,
    accounts: any
  ): Promise<ExchangePublicTokenResponse> {
    return this.callProxy(
      ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].method,
      ENDPOINTS['CREATE_LINK_TOKEN_RESPONSE'].proxy,
      {
        publicToken: publicToken,
        institutionId: institutionId,
        institutionName: institutionName,
        accounts: accounts,
      }
    )
      .then(
        (response: AxiosResponse): ResponseArguments<ExchangePublicTokenData> =>
          this.getResponseArgs<ExchangePublicTokenData>(response)
      )
      .then(
        (args: ResponseArguments<ExchangePublicTokenData>): ExchangePublicTokenResponse =>
          new ExchangePublicTokenResponse(args)
      );
  }

  private static async callProxy(method: string, path: string, data?: any): Promise<AxiosResponse> {
    const config: any = {
      method: method,
      url: `${this.PROXY_URL}${path}`,
      validateStatus: function (status: number): boolean {
        return true;
      },
    };

    if (data) {
      config.data = data;
    }

    return axios(config);
  }

  private static getResponseArgs<T>(response: AxiosResponse): ResponseArguments<T> {
    return {
      statusCode: response.status,
      service: response.data['Service'] || response.data['service'],
      domain: response.data['Domain'] || response.data['domain'],
      api: response.data['API'] || response.data['api'],
      requestId: response.data['RequestId'] || response.data['requestId'],
      status: response.data['Status'] || response.data['status'],
      message: response.data['Message'] || response.data['message'],
      responseTimeMillis:
        response.data['ResponseTimeMillis'] || response.data['responseTimeMillis'],
      data: response.data['Data'] || response.data['data'] || undefined,
    };
  }
}
