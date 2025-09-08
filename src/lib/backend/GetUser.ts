import WalterBackendAPIResponse from '@/lib/backend/Response';
import { User } from '@/lib/models/User';

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
  private constructor(
    status_code: number,
    service: string,
    domain: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: GetUserData
  ) {
    super(status_code, service, domain, api, status, message, responseTimeMillis, data);
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

  public static create(
    status_code: number,
    service: string,
    domain: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: GetUserData
  ): GetUserResponse {
    return new GetUserResponse(
      status_code,
      service,
      domain,
      api,
      status,
      message,
      responseTimeMillis,
      data
    );
  }
}
