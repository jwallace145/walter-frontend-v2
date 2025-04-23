export const WALTER_API_ENDPOINT: string = process.env.NEXT_PUBLIC_WALTER_API_ENDPOINT as string;
export const WALTER_API_TOKEN_NAME: string = 'WALTER_API_TOKEN';

export const US_DOLLAR: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
