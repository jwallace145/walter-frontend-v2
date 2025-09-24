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
  merchant_name: string;
  is_plaid_transaction: boolean;
}
