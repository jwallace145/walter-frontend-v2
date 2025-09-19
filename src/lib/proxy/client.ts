import axios, { AxiosResponse } from 'axios';

import { PROXY_ENDPOINTS } from '@/lib/proxy/endpoints';
import { ResponseArguments } from '@/lib/proxy/response';
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
} from '@/lib/proxy/responses';

export class WalterBackendProxy {
  static readonly PROXY_URL: string = '/api';

  static readonly REFRESH_TOKEN_KEY: string = 'WALTER_BACKEND_REFRESH_TOKEN';
  static readonly ACCESS_TOKEN_KEY: string = 'WALTER_BACKEND_ACCESS_TOKEN';

  public static async login(email: string, password: string): Promise<LoginResponse> {
    return this.callProxy(PROXY_ENDPOINTS['LOGIN'].method, PROXY_ENDPOINTS['LOGIN'].path, {
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
    return this.callProxy(PROXY_ENDPOINTS['LOGOUT'].method, PROXY_ENDPOINTS['LOGOUT'].path)
      .then(
        (response: AxiosResponse): ResponseArguments<LogoutData> =>
          this.getResponseArgs<LogoutData>(response)
      )
      .then((args: ResponseArguments<LogoutData>): LogoutResponse => new LogoutResponse(args));
  }

  public static async createUser(): Promise<CreateUserResponse> {
    return this.callProxy(
      PROXY_ENDPOINTS['CREATE_USER'].method,
      PROXY_ENDPOINTS['CREATE_USER'].path
    )
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
      PROXY_ENDPOINTS['CREATE_LINK_TOKEN'].method,
      PROXY_ENDPOINTS['CREATE_LINK_TOKEN'].path
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
      PROXY_ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].method,
      PROXY_ENDPOINTS['CREATE_LINK_TOKEN_RESPONSE'].path,
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

  public static isValidMethod(method: string | undefined, validMethods: string[]): boolean {
    if (!method) return false;
    return validMethods.includes(method);
  }

  private static async callProxy(method: string, path: string, data?: any): Promise<AxiosResponse> {
    const config: any = {
      method: method,
      url: `${this.PROXY_URL}${path}`,
      validateStatus: function (status: number): boolean {
        return true;
      },
      withCredentials: true, // TODO: I don't think this is necessary for all api endpoints
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
