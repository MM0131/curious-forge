-- Create custom types
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE blueprint_status AS ENUM ('draft', 'published');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blueprints table
CREATE TABLE blueprints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  duration TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  tools JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  science_explanation TEXT,
  safety_notes JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  video_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status blueprint_status DEFAULT 'draft',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  materials JSONB DEFAULT '[]'::jsonb,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  status submission_status DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Saved blueprints table (user bookmarks)
CREATE TABLE saved_blueprints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, blueprint_id)
);

-- Create indexes for better performance
CREATE INDEX idx_blueprints_category ON blueprints(category);
CREATE INDEX idx_blueprints_difficulty ON blueprints(difficulty);
CREATE INDEX idx_blueprints_status ON blueprints(status);
CREATE INDEX idx_blueprints_author ON blueprints(author_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_saved_blueprints_user ON saved_blueprints(user_id);
CREATE INDEX idx_saved_blueprints_blueprint ON saved_blueprints(blueprint_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON blueprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_blueprints ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Blueprints policies
CREATE POLICY "Published blueprints are viewable by everyone"
  ON blueprints FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create blueprints"
  ON blueprints FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own blueprints"
  ON blueprints FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own blueprints"
  ON blueprints FOR DELETE
  USING (auth.uid() = author_id);

-- Submissions policies
CREATE POLICY "Anyone can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view all submissions"
  ON submissions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE email LIKE '%@admin.curiousforge.com'
  ));

-- Saved blueprints policies
CREATE POLICY "Users can view own saved blueprints"
  ON saved_blueprints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save blueprints"
  ON saved_blueprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave blueprints"
  ON saved_blueprints FOR DELETE
  USING (auth.uid() = user_id);

-- Function to create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
