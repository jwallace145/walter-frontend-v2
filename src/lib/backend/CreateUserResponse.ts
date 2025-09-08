import WalterBackendAPIResponse from '@/lib/backend/Response';

export interface CreateUserResponseData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
  sign_up_date: string;
}

export class CreateUserResponse extends WalterBackendAPIResponse<CreateUserResponseData> {
  private constructor(
    statusCode: number,
    service: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: CreateUserResponseData
  ) {
    super(statusCode, service, api, status, message, responseTimeMillis, data);
  }

  public static create(statusCode: number, data: any): CreateUserResponse {
    return new CreateUserResponse(
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
