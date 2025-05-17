-- Add score field to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'score'
  ) THEN
    ALTER TABLE profiles ADD COLUMN score INTEGER DEFAULT 0;
  END IF;
END $$; 