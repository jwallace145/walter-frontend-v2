export interface Account {
  linked_with_plaid: boolean;
  account_id: string;
  institution_name: string;
  account_name: string;
  account_type: string;
  account_subtype: string;
  balance: number;
  updated_at: string;
}
