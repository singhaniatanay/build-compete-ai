-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE,
  user_type TEXT CHECK (user_type IN ('participant', 'company')),
  company_name TEXT
);

-- Create RLS policy for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view any profile" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, updated_at, user_type)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url', now(), NULL);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile after signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  participants INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Create RLS policy for challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view challenges" ON public.challenges 
  FOR SELECT USING (true);
CREATE POLICY "Company users can create challenges" ON public.challenges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'company'
    )
  );
CREATE POLICY "Company users can update their own challenges" ON public.challenges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'company'
      AND created_by = auth.uid()
    )
  );

-- Create challenge_participants table
CREATE TABLE IF NOT EXISTS public.challenge_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Create RLS policy for challenge participants
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view challenge participants" ON public.challenge_participants
  FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON public.challenge_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own participation" ON public.challenge_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to increment participant count
CREATE OR REPLACE FUNCTION public.increment_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.challenges
  SET participants = participants + 1
  WHERE id = NEW.challenge_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to increment participant count on join
CREATE TRIGGER on_challenge_participant_created
  AFTER INSERT ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.increment_participant_count();

-- Create function to decrement participant count
CREATE OR REPLACE FUNCTION public.decrement_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.challenges
  SET participants = participants - 1
  WHERE id = OLD.challenge_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to decrement participant count on leave
CREATE TRIGGER on_challenge_participant_deleted
  AFTER DELETE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.decrement_participant_count();

-- Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  score INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'rejected')),
  feedback TEXT,
  github_url TEXT,
  video_url TEXT,
  presentation_url TEXT,
  description TEXT,
  UNIQUE(challenge_id, user_id)
);

-- Create RLS policy for submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company users can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'company'
    )
  );
CREATE POLICY "Users can view own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit solutions" ON public.submissions
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM challenge_participants
      WHERE challenge_participants.challenge_id = challenge_id
      AND challenge_participants.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update own submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge_id ON public.challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user_id ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_id ON public.submissions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id); 