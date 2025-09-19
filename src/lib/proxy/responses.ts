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
  institution_name: string;
  num_accounts: number;
}

export class ExchangePublicTokenResponse extends WalterBackendAPIResponse<ExchangePublicTokenData> {
  public constructor(args: ResponseArguments<ExchangePublicTokenData>) {
    super(args);
  }
}
