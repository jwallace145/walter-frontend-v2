export interface User {
  email: string;
  username: string;
  verified: boolean;
  subscribed: boolean;
  sign_up_date: string;
  last_active_date: string;
  profile_picture_url: string;
  free_trial_end_date: string;
  active_stripe_subscription: boolean;
}
