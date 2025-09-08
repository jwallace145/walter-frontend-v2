import WalterBackendAPIResponse from '@/lib/backend/Response';

export interface RefreshData {
  user_id: string;
  access_token: string;
  access_token_expires_at: string;
}

export class RefreshResponse extends WalterBackendAPIResponse<RefreshData> {
  private constructor(
    statusCode: number,
    service: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: RefreshData
  ) {
    super(statusCode, service, api, status, message, responseTimeMillis, data);
  }

  public getAccessToken(): string {
    if (!this.data?.access_token) {
      throw new Error('Access token is not provided. Please check if the user is logged in.');
    }
    return this.data.access_token;
  }

  public static create(statusCode: number, data: any): RefreshResponse {
    return new RefreshResponse(
      statusCode,
      data['Service'],
      data['API'],
      data['Status'],
      data['Message'],
      data['ResponseTimeMillis'],
      data['Data']
    );
  }
}
