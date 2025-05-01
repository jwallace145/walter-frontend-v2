import { getCookie } from 'typescript-cookie';

import { WALTER_API_TOKEN_NAME } from '@/lib/constants/Constants';
import { Transaction, TransactionCategory } from '@/lib/models/Transaction';

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

/**
 * Validates if the given string is a valid email address.
 *
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * This method downloads the given transactions as a CSV file to the user's
 * computer.
 *
 * @param transactions The user's transactions to download.
 * @param filename The name of the CSV file to download. Defaults to 'transactions.csv'.
 */
export function downloadTransactionsAsCSV(
  transactions: Transaction[],
  filename = 'transactions.csv'
) {
  if (!transactions || transactions.length === 0) return;

  const headers: string[] = Object.keys(transactions[0]);
  const csvRows: string[] = [
    headers.join(','), // header row
    ...transactions.map((transaction: Transaction): string =>
      headers
        .map((key: string): string => {
          const val = (transaction as any)[key];
          if (typeof val === 'string') {
            return `"${val.replace(/"/g, '""')}"`; // escape quotes
          }
          return val;
        })
        .join(',')
    ),
  ];

  const csvContent: string = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
