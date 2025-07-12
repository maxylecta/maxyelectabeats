/*
  # Update user profiles and subscription management

  1. Tables
    - Ensure `user_profiles` table exists with all required columns
    - Add any missing columns to existing table

  2. Security
    - Enable RLS on `user_profiles` table
    - Create policies only if they don't exist
    - Add policy for service role to manage all profiles

  3. Functions
    - Update trigger function to create profile on user signup
    - Function to handle subscription updates from webhooks
    - Function to get user subscription info
    - Function to notify n8n webhook on user creation

  4. Triggers
    - Ensure trigger exists for new user signup
    - Ensure trigger exists for n8n notification
*/

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'premium')),
  subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'incomplete')),
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add first_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN first_name text;
  END IF;

  -- Add last_name if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_name text;
  END IF;

  -- Add subscription_plan if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro', 'premium'));
  END IF;

  -- Add subscription_status if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'incomplete'));
  END IF;

  -- Add stripe_customer_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop and recreate "Users can read own profile" policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can read own profile'
  ) THEN
    DROP POLICY "Users can read own profile" ON user_profiles;
  END IF;

  -- Drop and recreate "Users can update own profile" policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
  ) THEN
    DROP POLICY "Users can update own profile" ON user_profiles;
  END IF;

  -- Drop and recreate "Service role can manage all profiles" policy
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Service role can manage all profiles'
  ) THEN
    DROP POLICY "Service role can manage all profiles" ON user_profiles;
  END IF;
END $$;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create or replace function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create or replace function to update user subscription
CREATE OR REPLACE FUNCTION update_user_subscription(
  user_email text,
  plan text,
  status text DEFAULT 'active',
  customer_id text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET 
    subscription_plan = plan,
    subscription_status = status,
    stripe_customer_id = COALESCE(customer_id, stripe_customer_id),
    updated_at = now()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to get user subscription info
CREATE OR REPLACE FUNCTION get_user_subscription(user_id uuid)
RETURNS TABLE(
  plan text,
  status text,
  discount_percentage integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.subscription_plan,
    up.subscription_status,
    CASE 
      WHEN up.subscription_plan = 'basic' THEN 20
      WHEN up.subscription_plan = 'pro' THEN 30
      WHEN up.subscription_plan = 'premium' THEN 40
      ELSE 0
    END as discount_percentage
  FROM user_profiles up
  WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace function to notify n8n webhook on user creation
CREATE OR REPLACE FUNCTION notify_n8n_on_user_insert()
RETURNS trigger AS $$
DECLARE
  webhook_url text := 'https://maxyelectazone.app.n8n.cloud/webhook/notify-user-created';
  payload json;
BEGIN
  -- Prepare payload for n8n webhook
  payload := json_build_object(
    'actionType', 'user_created',
    'user_id', NEW.id,
    'email', NEW.email,
    'first_name', NEW.first_name,
    'last_name', NEW.last_name,
    'subscription_plan', NEW.subscription_plan,
    'subscription_status', NEW.subscription_status,
    'timestamp', NEW.created_at,
    'source', 'supabase_trigger'
  );

  -- Note: HTTP requests from triggers require extensions in production
  -- This is handled via the Supabase Edge Function instead
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to notify n8n on user profile creation (drop if exists first)
DROP TRIGGER IF EXISTS notify_n8n_on_user_profile_insert ON user_profiles;
CREATE TRIGGER notify_n8n_on_user_profile_insert
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION notify_n8n_on_user_insert();