export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

function toHttpStatus(
  code: number,
  fallback: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): HttpStatus {
  return Object.values(HttpStatus).includes(code) ? (code as HttpStatus) : fallback;
}

abstract class WalterBackendAPIResponse<TData = Record<string, any>> {
  statusCode: HttpStatus;
  service: string;
  domain: string;
  api: string;
  status: string;
  message: string;
  responseTimeMillis: number;
  data?: TData;

  protected constructor(
    statusCode: number,
    service: string,
    domain: string,
    api: string,
    status: string,
    message: string,
    responseTimeMillis: number,
    data?: TData
  ) {
    this.statusCode = toHttpStatus(statusCode);
    this.service = service;
    this.domain = domain;
    this.api = api;
    this.status = status;
    this.message = message;
    this.responseTimeMillis = responseTimeMillis;
    this.data = data;
  }

  public getStatusCode(): HttpStatus {
    return this.statusCode;
  }

  public isSuccess(): boolean {
    return this.status.toLowerCase() === 'success';
  }

  public isFailure(): boolean {
    return this.status === 'failure';
  }

  public isNotAuthorized(): boolean {
    return this.statusCode === HttpStatus.UNAUTHORIZED;
  }

  public isNotFound(): boolean {
    return this.statusCode === HttpStatus.NOT_FOUND;
  }
}

export default WalterBackendAPIResponse;
