-- Project enhancements: BAT history, settings
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS bat_version integer DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.bat_files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version integer NOT NULL,
  status bat_status NOT NULL DEFAULT 'pending',
  file_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS bat_files_project_version_idx
  ON public.bat_files(project_id, version);

ALTER TABLE public.bat_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bat_files_admin_access" ON public.bat_files;
CREATE POLICY "bat_files_admin_access"
ON public.bat_files
FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','expert')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','expert')));

CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_admin_access" ON public.settings;
CREATE POLICY "settings_admin_access"
ON public.settings
FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin')))
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin')));

CREATE OR REPLACE FUNCTION public.touch_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.touch_settings_updated_at();
