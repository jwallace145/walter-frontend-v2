import WalterBackendAPIResponse from '@/lib/backend/Response';

export interface LoginData {
  user_id: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
}

export class LoginResponse extends WalterBackendAPIResponse<LoginData> {
  private constructor(
    statusCode: number,
    service: string,
    domain: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: LoginData
  ) {
    super(statusCode, service, domain, api, status, message, responseTimeMillis, data);
  }

  public getRefreshToken(): string {
    if (!this.data?.refresh_token) {
      throw new Error('Refresh token is not provided. Please check if the user is logged in.');
    }
    return this.data.refresh_token;
  }

  public getAccessToken(): string {
    if (!this.data?.access_token) {
      throw new Error('Access token is not provided. Please check if the user is logged in.');
    }
    return this.data.access_token;
  }

  public static create(
    statusCode: number,
    service: string,
    domain: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: LoginData
  ): LoginResponse {
    return new LoginResponse(
      statusCode,
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
