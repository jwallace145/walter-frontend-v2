export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * This function converts an HTTP status code to its corresponding HttpStatus
 * enum member.
 *
 * @param code The HTTP status code
 * @param fallback The HttpStatus enum member to fallback on
 */
export function toHttpStatus(
  code: number | undefined,
  fallback: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR
): HttpStatus {
  if (!code) return fallback;
  return Object.values(HttpStatus).includes(code) ? (code as HttpStatus) : fallback;
}
