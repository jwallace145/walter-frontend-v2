import axios, { AxiosResponse } from 'axios';
import { getCookie, setCookie } from 'typescript-cookie';

import { CreateLinkTokenResponse } from '@/lib/backend/CreateLinkToken';
import { CreateUserResponse } from '@/lib/backend/CreateUserResponse';
import { GetUserResponse } from '@/lib/backend/GetUser';
import { LoginResponse } from '@/lib/backend/Login';
import { RefreshResponse } from '@/lib/backend/Refresh';
import { HttpStatus } from '@/lib/backend/Response';
import { AccountTransaction } from '@/lib/models/AccountTransaction';
import { TransactionCategory } from '@/lib/models/Transaction';
import { getTransactionCategory } from '@/lib/utils/Utils';

/**
 * The client for WalterBackend service.
 *
 * The WalterBackend service provides API endpoints for the frontend client
 * to use to display user and account information.
 */
export class WalterBackend {
  /**
   * The URL of the WalterBackend API. Varies by domain.
   */
  static readonly API_URL: string = process.env.NEXT_PUBLIC_WALTER_API_ENDPOINT as string;

  /**
   * The name of the refresh and access token keys used for authentication.
   */
  static readonly REFRESH_TOKEN_KEY: string = 'WALTER_BACKEND_REFRESH_TOKEN';
  static readonly ACCESS_TOKEN_KEY: string = 'WALTER_BACKEND_ACCESS_TOKEN';

  /**
   * The endpoints served by WalterBackend API.
   */
  static readonly ENDPOINTS: { [key: string]: { method: string; path: string } } = {
    LOGIN: { method: 'POST', path: '/auth/login' },
    REFRESH: { method: 'POST', path: '/auth/refresh' },
    LOGOUT: { method: 'POST', path: '/auth/logout' },
    GET_USER: { method: 'GET', path: '/users' },
    CREATE_USER: { method: 'POST', path: '/users' },
    GET_TRANSACTIONS: { method: 'GET', path: '/transactions' },
    EDIT_TRANSACTION: { method: 'PUT', path: '/transactions' },
    ADD_TRANSACTION: { method: 'POST', path: '/transactions' },
    DELETE_TRANSACTION: { method: 'DELETE', path: '/transactions' },
    CREATE_LINK_TOKEN: { method: 'POST', path: '/plaid/create-link-token' },
    EXCHANGE_PUBLIC_TOKEN: { method: 'POST', path: '/plaid/exchange-public-token' },
  };

  public static readonly ACCESS_TOKEN_EXPIRED_ERROR_MESSAGE: string = 'Access token expired';
  public static readonly REFRESH_TOKEN_EXPIRED_ERROR_MESSAGE: string = 'Refresh token expired';

  /*******************************
   * WalterBackend API Endpoints *
   *******************************/

  /**
   * Authenticates a user with email and password.
   *
   * Creates a new session and returns a short-lived access token plus a long-lived
   * refresh token. The access token is required for authenticated API requests;
   * when it expires, the refresh token can be exchanged for a new one until it
   * also expires, at which point the user must log in again.
   *
   * @param email - User email
   * @param password - User password
   * @returns LoginResponse with access and refresh tokens
   */
  public static async login(email: string, password: string): Promise<LoginResponse> {
    const method: string = this.ENDPOINTS['LOGIN'].method;
    const path: string = this.ENDPOINTS['LOGIN'].path;
    const url: string = `${this.API_URL}${path}`;
    const data = { email, password };

    try {
      // attempt to login user with the given email and password
      const response: AxiosResponse = await axios({
        method: method,
        url: url,
        data: data,
      });

      // if no axios errors thrown, 2xx http response, return successful Login API response
      return LoginResponse.create(
        response.status,
        response.data['Service'],
        response.data['Domain'],
        response.data['API'],
        response.data['Status'],
        response.data['Message'],
        response.data['ResponseTimeMillis'],
        response.data['Data']
      );
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === HttpStatus.UNAUTHORIZED) {
          return LoginResponse.create(
            HttpStatus.UNAUTHORIZED,
            error.response?.data['Service'],
            error.response?.data['Domain'],
            error.response?.data['API'],
            error.response?.data['Status'],
            error.response?.data['Message'],
            error.response?.data['ResponseTimeMillis'],
            undefined
          );
        } else if (error.response?.status === HttpStatus.NOT_FOUND) {
          return LoginResponse.create(
            HttpStatus.NOT_FOUND,
            error.response?.data['Service'],
            error.response?.data['Domain'],
            error.response?.data['API'],
            error.response?.data['Status'],
            error.response?.data['Message'],
            error.response?.data['ResponseTimeMillis'],
            undefined
          );
        }
      }
      throw error;
    }
  }

  public static async refresh(refreshToken: string): Promise<RefreshResponse> {
    const method: string = this.ENDPOINTS['REFRESH'].method;
    const path: string = this.ENDPOINTS['REFRESH'].path;
    return axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })
      .then(
        (axios: AxiosResponse): RefreshResponse => RefreshResponse.create(axios.status, axios.data)
      )
      .catch((error: any) => {
        if (axios.isAxiosError(error) && error.response?.status === HttpStatus.UNAUTHORIZED) {
          return RefreshResponse.create(HttpStatus.UNAUTHORIZED, error.response?.data);
        }
        throw error;
      });
  }

  public static async logout(token: string): Promise<null> {
    const method: string = this.ENDPOINTS['LOGOUT'].method;
    const path: string = this.ENDPOINTS['LOGOUT'].path;
    return axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  public static async getUser(accessToken: string): Promise<GetUserResponse> {
    const method: string = this.ENDPOINTS['GET_USER'].method;
    const path: string = this.ENDPOINTS['GET_USER'].path;
    const url: string = `${this.API_URL}${path}`;
    const headers: { Authorization: string } = { Authorization: `Bearer ${accessToken}` };

    try {
      const response: AxiosResponse = await axios({
        method: method,
        url: url,
        headers: headers,
      });

      return GetUserResponse.create(
        response.status,
        response.data['Service'],
        response.data['Domain'],
        response.data['API'],
        response.data['Status'],
        response.data['Message'],
        response.data['ResponseTimeMillis'],
        response.data['Data']
      );
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === HttpStatus.UNAUTHORIZED) {
        return GetUserResponse.create(HttpStatus.UNAUTHORIZED, error.response?.data);
      }
      throw error;
    }
  }

  public static async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<CreateUserResponse> {
    const method: string = this.ENDPOINTS['CREATE_USER'].method;
    const path: string = this.ENDPOINTS['CREATE_USER'].path;
    return axios({
      method: method,
      url: `${this.API_URL}/${path}`,
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      },
    }).then((response: AxiosResponse): any => response.data);
  }

  public static async getTransactions(
    token: string,
    startDate: string,
    endDate: string
  ): Promise<AccountTransaction[]> {
    const method: string = this.ENDPOINTS['GET_TRANSACTIONS'].method;
    const path: string = this.ENDPOINTS['GET_TRANSACTIONS'].path;
    return axios({
      method: method,
      url: `${this.API_URL}/${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    })
      .then((response: AxiosResponse) => response.data)
      .then((data) => data['Data']['transactions'])
      .then((transactions) => {
        return transactions.map(
          (transaction: {
            account_id: string;
            bank_name: string;
            account_name: string;
            account_type: string;
            account_last_four_numbers: string;
            transaction_id: string;
            date: string;
            vendor: string;
            amount: number;
            category: string;
            reviewed: boolean;
          }): AccountTransaction => {
            return {
              account_id: transaction.account_id,
              bank_name: transaction.bank_name,
              account_name: transaction.account_name,
              account_type: transaction.account_type ?? 'CHECKING',
              account_last_four_numbers: transaction.account_last_four_numbers,
              transaction_id: transaction.transaction_id,
              transaction_date: transaction.date,
              transaction_vendor: transaction.vendor,
              transaction_amount: transaction.amount,
              transaction_category: getTransactionCategory(
                transaction.category
              ) as TransactionCategory,
              transaction_reviewed: transaction.reviewed,
            };
          }
        );
      }) as Promise<AccountTransaction[]>;
  }

  public static async editTransaction(
    token: string,
    transaction_date: string,
    transaction_id: string,
    updated_date: string,
    updated_vendor: string,
    updated_amount: number,
    updated_category: string
  ): Promise<any> {
    const method: string = this.ENDPOINTS['EDIT_TRANSACTION'].method;
    const path: string = this.ENDPOINTS['EDIT_TRANSACTION'].path;
    return axios({
      method: method,
      url: `${this.API_URL}/${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        transaction_date: transaction_date,
        transaction_id: transaction_id,
        updated_date: updated_date,
        updated_vendor: updated_vendor,
        updated_amount: updated_amount,
        updated_category: updated_category,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async addTransaction(
    token: string,
    account_id: string,
    date: string,
    vendor: string,
    amount: number
  ): Promise<any> {
    const method: string = this.ENDPOINTS['ADD_TRANSACTION'].method;
    const path: string = this.ENDPOINTS['ADD_TRANSACTION'].path;
    return await axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        account_id: account_id,
        date: date,
        vendor: vendor,
        amount: amount,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async deleteTransaction(
    token: string,
    transactionId: string,
    date: string
  ): Promise<void> {
    const method: string = this.ENDPOINTS['DELETE_TRANSACTION'].method;
    const path: string = this.ENDPOINTS['DELETE_TRANSACTION'].path;
    return await axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        date: date,
        transaction_id: transactionId,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async createLinkToken(token: string): Promise<CreateLinkTokenResponse> {
    const method: string = this.ENDPOINTS['CREATE_LINK_TOKEN'].method;
    const path: string = this.ENDPOINTS['CREATE_LINK_TOKEN'].path;
    return axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response: AxiosResponse): any => response.data);
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
  ): Promise<void> {
    const method: string = this.ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].method;
    const path: string = this.ENDPOINTS['EXCHANGE_PUBLIC_TOKEN'].path;
    axios({
      method: method,
      url: `${this.API_URL}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        public_token: publicToken,
        institution_id: institutionId,
        institution_name: institutionName,
        accounts: accounts,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  /***************************************
   * WalterBackend Authentication Tokens *
   ***************************************/

  public static getRefreshToken(): string {
    const token: string | undefined = getCookie(this.REFRESH_TOKEN_KEY);
    if (!token) {
      throw new Error('No refresh token found!');
    }
    return token;
  }

  public static setRefreshToken(token: string): void {
    setCookie(this.REFRESH_TOKEN_KEY, token);
  }

  public static unsetRefreshToken(): void {
    setCookie(this.REFRESH_TOKEN_KEY, '', { expires: new Date(0) });
  }

  public static getAccessToken(): string {
    const token: string | undefined = getCookie(this.ACCESS_TOKEN_KEY);
    if (!token) {
      throw new Error('No access token found!');
    }
    return token;
  }

  public static setAccessToken(token: string): void {
    setCookie(this.ACCESS_TOKEN_KEY, token);
  }

  public static unsetAccessToken(): void {
    setCookie(this.ACCESS_TOKEN_KEY, '', { expires: new Date(0) });
  }
}
