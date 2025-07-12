import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  subscription_plan: 'free' | 'basic' | 'pro' | 'premium';
  subscription_status: 'active' | 'cancelled' | 'past_due' | 'incomplete';
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  discount_percentage: number;
}