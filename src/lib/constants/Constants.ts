/**
 * The name of the cookie used to make authenticated requests
 * to Walter API.
 */
export const WALTER_API_TOKEN_NAME: string = 'WALTER_API_TOKEN';

export const US_DOLLAR: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
