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

export interface BankTransaction {
  transaction_id: string;
  account_id: string;
  user_id: string;
  transaction_type: string;
  transaction_subtype: string;
  transaction_category: string;
  transaction_date: string;
  vendor: string;
  transaction_amount: number;
  category: TransactionCategory;
  reviewed: boolean;
}
