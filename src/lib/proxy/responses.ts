import { Account } from '@/lib/models/account';
import { Transaction } from '@/lib/models/transaction';
import { User } from '@/lib/models/User';
import WalterBackendAPIResponse, { ResponseArguments } from '@/lib/proxy/response';

export interface LoginData {
  user_id: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

export class LoginResponse extends WalterBackendAPIResponse<LoginData> {
  public constructor(args: ResponseArguments<LoginData>) {
    super(args);
  }
}

export interface LogoutData {
  user_id: string;
  session_id: string;
  session_start: string;
  session_end: string;
}

export class LogoutResponse extends WalterBackendAPIResponse<LogoutData> {
  public constructor(args: ResponseArguments<LogoutData>) {
    super(args);
  }
}

export interface GetUserData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
  sign_up_date: string;
  last_active_date: string;
  profile_picture_url: string;
  active_stripe_subscription: boolean;
}

export class GetUserResponse extends WalterBackendAPIResponse<GetUserData> {
  public constructor(args: ResponseArguments<GetUserData>) {
    super(args);
  }

  public getUser(): User {
    if (!this.data) {
      throw new Error('User data is not provided. Please check if the user is logged in.');
    }
    return {
      user_id: this.data.user_id,
      email: this.data.email,
      first_name: this.data.first_name,
      last_name: this.data.last_name,
      verified: this.data.verified,
      sign_up_date: this.data.sign_up_date,
      last_active_date: this.data.last_active_date,
      profile_picture_url: this.data.profile_picture_url,
      active_stripe_subscription: this.data.active_stripe_subscription,
    };
  }
}

export interface CreateUserData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
  sign_up_date: string;
}

export class CreateUserResponse extends WalterBackendAPIResponse<CreateUserData> {
  public constructor(args: ResponseArguments<CreateUserData>) {
    super(args);
  }
}

export interface GetAccountsData {
  user_id: string;
  total_num_accounts: number;
  total_balance: number;
  accounts: Account[];
}

export class GetAccountsResponse extends WalterBackendAPIResponse<GetAccountsData> {
  public constructor(args: ResponseArguments<GetAccountsData>) {
    super(args);
  }

  public getPlaidAccounts(): Account[] {
    if (!this.data?.accounts) {
      throw new Error('Accounts are not provided.');
    }
    return this.data.accounts.filter((account: Account): boolean => account.linked_with_plaid);
  }
}

export interface GetTransactionsData {
  user_id: string;
  num_transactions: number;
  total_income: number;
  total_expense: number;
  cash_flow: number;
  transactions: Transaction[];
}

export class GetTransactionsResponse extends WalterBackendAPIResponse<GetTransactionsData> {
  public constructor(args: ResponseArguments<GetTransactionsData>) {
    super(args);
  }

  public getTotalIncome(): number {
    return this.data?.total_income ?? -1.0;
  }

  public getTotalExpenses(): number {
    return this.data?.total_expense ?? -1.0;
  }

  public getCashFlow(): number {
    return this.data?.cash_flow ?? -1.0;
  }

  public getTransactions(): Transaction[] {
    if (!this.data?.transactions) {
      throw new Error('Transactions are not provided.');
    }
    return this.data.transactions;
  }
}

export interface UpdateTransactionData {
  transaction: Transaction;
}

export class UpdateTransactionResponse extends WalterBackendAPIResponse<UpdateTransactionData> {
  public constructor(args: ResponseArguments<UpdateTransactionData>) {
    super(args);
  }
}

export interface CreateLinkTokenData {
  request_id: string;
  user_id: string;
  link_token: string;
  expiration: string;
}

export class CreateLinkTokenResponse extends WalterBackendAPIResponse<CreateLinkTokenData> {
  public constructor(args: ResponseArguments<CreateLinkTokenData>) {
    super(args);
  }

  public getLinkToken(): string {
    if (!this.data?.link_token) {
      throw new Error('Link token is not provided.');
    }
    return this.data.link_token;
  }
}

export interface ExchangePublicTokenData {
  institution_id: string;
  institution_name: string;
  num_accounts: number;
  sync_transactions_task_ids: string;
}

export class ExchangePublicTokenResponse extends WalterBackendAPIResponse<ExchangePublicTokenData> {
  public constructor(args: ResponseArguments<ExchangePublicTokenData>) {
    super(args);
  }
}

export interface SyncTransactionsData {
  user_id: string;
  task_id: string;
  institution_name: string;
  accounts: { account_id: string; account_name: string }[];
}

export class SyncTransactionsResponse extends WalterBackendAPIResponse<SyncTransactionsData> {
  public constructor(args: ResponseArguments<SyncTransactionsData>) {
    super(args);
  }

  public getTaskId() {
    if (!this.data?.task_id) {
      throw new Error('Task ID is not provided.');
    }
    return this.data.task_id;
  }
}
