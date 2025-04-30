import { getCookie } from 'typescript-cookie';

import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { TransactionCategory } from '@/lib/models/Transaction';

/**
 * Get the TransactionCategory enum value for a given category string.
 *
 * @param category The transaction category string.
 */
export function getTransactionCategory(category: string): TransactionCategory | undefined {
  const categoryLower: string = category.trim().toLowerCase();
  const categories: TransactionCategory[] = Object.values(TransactionCategory);
  return categories.find(
    (category: TransactionCategory): boolean => category.toLowerCase() === categoryLower
  ) as TransactionCategory | undefined;
}

/**
 * Get the Walter API token from browser cookies.
 *
 * If the token is not set, this method returns an empty string.
 */
export function getWalterAPIToken(): string {
  return getCookie(WALTER_API_TOKEN_NAME) || '';
}
