/*
  # Add missing insert policy for user profiles

  1. Security
    - Add policy to allow users to insert their own profile during registration
    - This is needed for the FREE plan registration flow

  2. Changes
    - Add "Enable insert for users based on id" policy
*/

-- Add policy to allow users to insert their own profile
DO $$
BEGIN
  -- Drop and recreate "Enable insert for users based on id" policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Enable insert for users based on id'
  ) THEN
    DROP POLICY "Enable insert for users based on id" ON user_profiles;
  END IF;
END $$;

-- Create the insert policy
CREATE POLICY "Enable insert for users based on id"
  ON user_profiles
  FOR INSERT
  TO public
  WITH CHECK (id = auth.uid());