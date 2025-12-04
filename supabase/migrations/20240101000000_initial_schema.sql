-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'expert', 'student');
CREATE TYPE project_status AS ENUM ('draft', 'prepress', 'production', 'finished', 'delivered', 'archived');
CREATE TYPE bat_status AS ENUM ('pending', 'validated', 'rejected');
CREATE TYPE item_complexity AS ENUM ('NORMAL', 'EXPERT');
CREATE TYPE item_type AS ENUM ('glass_trophy', 'medal', 'cup', 'plexiglass', 'other');

-- PROFILES (Linked to auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLIENTS
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE, -- e.g., VIT-25-XXX
  title TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  status project_status DEFAULT 'draft',
  deadline TIMESTAMPTZ,
  tray_number TEXT, -- Physical tray in workshop
  bat_file_url TEXT,
  bat_status bat_status DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECT ITEMS
CREATE TABLE public.project_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  type item_type NOT NULL,
  complexity item_complexity DEFAULT 'NORMAL',
  specs JSONB DEFAULT '{}'::jsonb, -- Flexible tech specs
  
  -- Workflow flags
  is_ordered BOOLEAN DEFAULT FALSE, -- For BUY items
  is_received BOOLEAN DEFAULT FALSE, -- For BUY items
  
  -- Production steps (simple booleans for now, could be timestamped logs later)
  step_cut BOOLEAN DEFAULT FALSE,
  step_engrave BOOLEAN DEFAULT FALSE,
  step_assemble BOOLEAN DEFAULT FALSE,
  step_quality_control BOOLEAN DEFAULT FALSE,
  step_pack BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TIMESHEETS
CREATE TABLE public.timesheets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  project_id UUID REFERENCES public.projects(id),
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  description TEXT,
  is_edited BOOLEAN DEFAULT FALSE, -- Flag if manually corrected
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INCIDENTS (Basic log)
CREATE TABLE public.incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id),
  item_id UUID REFERENCES public.project_items(id),
  reported_by UUID REFERENCES public.profiles(id),
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'low',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRIVATE SCHEMA for Financials
CREATE SCHEMA IF NOT EXISTS operations_private;

CREATE TABLE operations_private.project_financials (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE PRIMARY KEY,
  total_price_ht NUMERIC(10, 2) DEFAULT 0,
  total_cost_ht NUMERIC(10, 2) DEFAULT 0,
  margin_ht NUMERIC(10, 2) GENERATED ALWAYS AS (total_price_ht - total_cost_ht) STORED,
  is_paid BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations_private.project_financials ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles: Readable by everyone (to see names), editable only by self or admin
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects:
-- Admin/Expert: Full access
-- Student: View only (no create/delete)
CREATE POLICY "Admin/Expert full access projects" ON public.projects 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'expert'))
  );

CREATE POLICY "Student view projects" ON public.projects 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student')
  );

-- Project Items: Same logic
CREATE POLICY "Admin/Expert full access items" ON public.project_items 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'expert'))
  );

CREATE POLICY "Student view items" ON public.project_items 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Student update items (production steps)" ON public.project_items 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student')
  );

-- Financials: ADMIN ONLY
CREATE POLICY "Admins only financials" ON operations_private.project_financials 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TRIGGER: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

