export enum TransactionCategory {
  BILLS = 'Bills',
  ENTERTAINMENT = 'Entertainment',
  GROCERIES = 'Groceries',
  HEALTH_AND_WELLNESS = 'Health and Wellness',
  HOBBIES = 'Hobbies',
  HOUSING = 'Housing',
  INCOME = 'Income',
  INSURANCE = 'Insurance',
  MERCHANDISE = 'Merchandise',
  RESTAURANTS = 'Restaurants',
  SHOPPING = 'Shopping',
  SUBSCRIPTIONS = 'Subscriptions',
  TRANSPORTATION = 'Transportation',
  TRAVEL = 'Travel',
}

export interface Transaction {
  date: string;
  transaction_id: string;
  vendor: string;
  amount: number;
  category: TransactionCategory;
  reviewed: boolean;
}
