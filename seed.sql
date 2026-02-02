-- Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  name TEXT,
  grade TEXT,
  avatar_url TEXT
);

-- Create Documents Table
CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pdf', 'doc', 'image')),
  size TEXT,
  file_url TEXT NOT NULL,
  student_id UUID REFERENCES profiles(id)
);

-- Create Reports Table
CREATE TABLE sessions_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date TEXT,
  subject TEXT,
  summary TEXT,
  full_feedback TEXT,
  next_goals TEXT[],
  is_new BOOLEAN DEFAULT FALSE,
  student_id UUID REFERENCES profiles(id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_reports ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read/Write for demo purposes - usually should be authenticated)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Public documents are viewable by everyone." ON documents FOR SELECT USING (true);
CREATE POLICY "Public documents are insertable by everyone." ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public reports are viewable by everyone." ON sessions_reports FOR SELECT USING (true);

-- Storage Bucket Setup (You need to create the bucket 'documents' in Supabase Storage manually or via API)
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Storage Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'documents' );
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'documents' );
