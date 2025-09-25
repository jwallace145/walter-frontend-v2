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
  INVESTMENT = 'Investment',
}

export interface Transaction {
  account_id: string;
  transaction_id: string;
  account_institution_name: string;
  account_name: string;
  account_type: string;
  account_mask: string;
  transaction_date: string;
  transaction_amount: number;
  transaction_type: string;
  transaction_subtype: string;
  transaction_category: TransactionCategory;
  merchant_name: string;
  merchant_logo_url: string;
  is_plaid_transaction: boolean;
}
