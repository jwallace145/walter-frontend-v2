export enum ExpenseCategory {
  BILLS = 'Bills',
  ENTERTAINMENT = 'Entertainment',
  GROCERIES = 'Groceries',
  HEALTH_AND_WELLNESS = 'Health & Wellness',
  HOBBIES = 'Hobbies',
  HOUSING = 'Housing',
  INSURANCE = 'Insurance',
  MERCHANDISE = 'Merchandise',
  RESTAURANTS = 'Restaurants',
  SHOPPING = 'Shopping',
  SUBSCRIPTIONS = 'Subscriptions',
  TRANSPORTATION = 'Transportation',
  TRAVEL = 'Travel',
}

export function getExpenseCategory(category: string): ExpenseCategory | undefined {
  const categoryLower: string = category.toLowerCase();
  return Object.values(ExpenseCategory).find(
    (category: ExpenseCategory): boolean => category.toLowerCase() === categoryLower
  );
}
