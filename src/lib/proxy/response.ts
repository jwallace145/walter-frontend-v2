import { HttpStatus, toHttpStatus } from '@/lib/proxy/statuses';

/********************************
 * WalterBackend Response Model *
 ********************************/

abstract class Response<TData = Record<string, any>> {
  statusCode: HttpStatus;
  service: string;
  domain: string;
  api: string;
  requestId: string;
  status: string;
  message: string;
  responseTimeMillis: number;
  data?: TData;

  protected constructor(args: ResponseArguments<TData>) {
    this.statusCode = toHttpStatus(args.statusCode);
    this.service = args.service;
    this.domain = args.domain;
    this.api = args.api;
    this.requestId = args.requestId;
    this.status = args.status;
    this.message = args.message;
    this.responseTimeMillis = args.responseTimeMillis;
    this.data = args.data;
  }

  public isSuccess(): boolean {
    return [HttpStatus.OK, HttpStatus.CREATED].includes(this.statusCode);
  }
}

export type ResponseArguments<TData = Record<string, any>> = {
  statusCode: number;
  service: string;
  domain: string;
  api: string;
  requestId: string;
  status: string;
  message: string;
  responseTimeMillis: number;
  data?: TData;
};

export default Response;
