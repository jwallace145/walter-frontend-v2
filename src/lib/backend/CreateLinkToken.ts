import WalterBackendAPIResponse from '@/lib/backend/Response';

export interface CreateLinkTokenData {
  request_id: string;
  user_id: string;
  link_token: string;
  expiration: string;
}

export class CreateLinkTokenResponse extends WalterBackendAPIResponse<CreateLinkTokenData> {
  private constructor(
    statusCode: number,
    service: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: CreateLinkTokenData
  ) {
    super(statusCode, service, api, status, message, responseTimeMillis, data);
  }

  public getLinkToken(): string {
    if (!this.data?.link_token) {
      throw new Error('Link token is not provided.');
    }
    return this.data.link_token;
  }

  public static create(statusCode: number, data: any): CreateLinkTokenResponse {
    return new CreateLinkTokenResponse(
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
