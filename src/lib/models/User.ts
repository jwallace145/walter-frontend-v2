export interface User {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  verified: boolean;
  sign_up_date: string;
  last_active_date: string;
  profile_picture_url: string;
  active_stripe_subscription: boolean;
}
