export interface AccountTransaction {
  account_id: string;
  bank_name: string;
  account_name: string;
  account_type: string;
  account_last_four_numbers: string;
  transaction_id: string;
  transaction_date: string;
  transaction_vendor: string;
  transaction_amount: number;
  transaction_category: string;
  transaction_reviewed: boolean;
}
