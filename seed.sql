-- 1. Updates de la table PROFILES
-- Note: 'role' might already exist if you ran previous seed, but using IF NOT EXISTS is safer or just ALTER.
-- Since we are defining the "Target State", here is the full schema logic.

-- Ensure profiles has necessary columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student' CHECK (role IN ('student', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grade text; -- ex: "6ème B"

-- 2. Table SUBJECTS (Matières & Progression)
CREATE TABLE IF NOT EXISTS subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL, -- ex: Maths
  progress integer DEFAULT 0, -- 0 à 100
  color text DEFAULT 'bg-blue-400', -- Classe Tailwind pour la couleur
  created_at timestamptz DEFAULT now()
);

-- 3. Table TASKS (Devoirs)
CREATE TABLE IF NOT EXISTS tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  category text, -- ex: Devoirs, Révisions
  color text DEFAULT 'bg-white',
  due_date text, -- Garder en texte pour l'instant "Demain", "Lundi" ou format date
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 4. Sécurité (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions_reports ENABLE ROW LEVEL SECURITY;

-- Note: You should replace 'TON_EMAIL_ADMIN_ICI' with your actual admin email if using email check,
-- or rely on the 'role' column if you have a way to set it (e.g. via Supabase dashboard manually first).
-- For this seed, we assume the user will handle the specific Admin Policy creation in the dashboard 
-- or we provide a generic one based on the 'role' column if the user can set their role.

CREATE POLICY "Admin full access" ON profiles FOR ALL USING (
  auth.jwt() ->> 'email' = 'admin@edusoft.com' OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Student view own" ON subjects FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin all subjects" ON subjects FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Student view own tasks" ON tasks FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "Admin all tasks" ON tasks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Documents & Reports policies (Previous ones might need update to be stricter)
CREATE POLICY "Student view own documents" ON documents FOR SELECT USING (auth.uid() = student_id OR student_id IS NULL); -- IS NULL for public/shared docs?
CREATE POLICY "Admin all documents" ON documents FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Student view own reports" ON sessions_reports FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admin all reports" ON sessions_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Automations (Triggers)
-- Function to create profile on sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, grade, email)
  VALUES (new.id, 'student', '6ème', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
