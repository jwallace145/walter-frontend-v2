import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { IncomingMessage } from 'http';
import { getCookie } from 'typescript-cookie';

import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { AccountTransaction } from '@/lib/models/AccountTransaction';
import { CashAccount } from '@/lib/models/CashAccount';
import { LinkToken } from '@/lib/models/LinkToken';
import { Newsletter } from '@/lib/models/Newsletter';
import { Portfolio } from '@/lib/models/Portfolio';
import { Price } from '@/lib/models/Price';
import { TransactionCategory } from '@/lib/models/Transaction';
import { User } from '@/lib/models/User';
import { getTransactionCategory } from '@/lib/utils/Utils';

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

  public static async createUser(
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ): Promise<any> {
    return axios({
      method: 'POST',
      url: `${WalterAPI.ENDPOINT}/users`,
      data: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      },
    }).then((response: AxiosResponse): any => response.data);
  }

  public static async updatePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    return await axios({
      method: 'POST',
      url: `${this.ENDPOINT}/passwords`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    }).then((response: AxiosResponse): any => response.data);
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
  ): Promise<AccountTransaction[]> {
    return axios({
      method: 'GET',
      url: `${WalterAPI.ENDPOINT}/transactions`,
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
            transaction_date: string;
            transaction_vendor: string;
            transaction_amount: number;
            transaction_category: string;
            transaction_reviewed: boolean;
          }): AccountTransaction => {
            return {
              account_id: transaction.account_id,
              bank_name: transaction.bank_name,
              account_name: transaction.account_name,
              account_type: transaction.account_type,
              account_last_four_numbers: transaction.account_last_four_numbers,
              transaction_id: transaction.transaction_id,
              transaction_date: transaction.transaction_date,
              transaction_vendor: transaction.transaction_vendor,
              transaction_amount: transaction.transaction_amount,
              transaction_category: getTransactionCategory(
                transaction.transaction_category
              ) as TransactionCategory,
              transaction_reviewed: transaction.transaction_reviewed,
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
    return axios({
      method: 'PUT',
      url: `${WalterAPI.ENDPOINT}/transactions`,
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
    return await axios({
      method: 'POST',
      url: `${this.ENDPOINT}/transactions`,
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
    return await axios({
      method: 'DELETE',
      url: `${this.ENDPOINT}/transactions`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        date: date,
        transaction_id: transactionId,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async addStock(token: string, stock: string, quantity: string): Promise<any> {
    return await axios({
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
    return await axios({
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

  public static async listNewsletters(token: string): Promise<Newsletter[]> {
    return axios({
      method: 'GET',
      url: `${this.ENDPOINT}/newsletters`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1,
      },
    }).then((response: AxiosResponse) => response.data.Data.newsletters);
  }

  public static async getCashAccounts(token: string): Promise<CashAccount[]> {
    return axios({
      method: 'GET',
      url: `${this.ENDPOINT}/cash-accounts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response: AxiosResponse) => response.data.Data.cash_accounts);
  }

  public static async updateCashAccount(
    token: string,
    accountId: string,
    bankName: string,
    accountName: string,
    accountLastFourNumbers: string,
    accountBalance: number
  ): Promise<CashAccount> {
    return axios({
      method: 'PUT',
      url: `${this.ENDPOINT}/cash-accounts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        account_id: accountId,
        bank_name: bankName,
        account_name: accountName,
        account_last_four_numbers: accountLastFourNumbers,
        balance: accountBalance,
      },
    }).then((response: AxiosResponse) => response.data.Data.account);
  }

  public static async deleteCashAccount(token: string, accountId: string): Promise<void> {
    return axios({
      method: 'DELETE',
      url: `${this.ENDPOINT}/cash-accounts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        account_id: accountId,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async createCashAccount(
    token: string,
    bankName: string,
    accountName: string,
    accountLastFourNumbers: string,
    accountBalance: number
  ): Promise<CashAccount> {
    return axios({
      method: 'POST',
      url: `${this.ENDPOINT}/cash-accounts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        bank_name: bankName,
        account_name: accountName,
        account_last_four_numbers: accountLastFourNumbers,
        balance: accountBalance,
      },
    }).then((response: AxiosResponse) => response.data);
  }

  public static async createLinkToken(token: string): Promise<LinkToken> {
    return axios({
      method: 'POST',
      url: `${this.ENDPOINT}/plaid/create-link-token`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response: AxiosResponse) => response.data);
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
    axios({
      method: 'POST',
      url: `${this.ENDPOINT}/plaid/exchange-public-token`,
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
