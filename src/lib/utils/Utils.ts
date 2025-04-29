import { TransactionCategory } from '@/lib/models/Transaction';

export function getTransactionCategory(category: string): TransactionCategory | undefined {
  const categoryLower: string = category.trim().toLowerCase();
  const categories: TransactionCategory[] = Object.values(TransactionCategory);
  return categories.find(
    (category: TransactionCategory): boolean => category.toLowerCase() === categoryLower
  ) as TransactionCategory | undefined;
}
