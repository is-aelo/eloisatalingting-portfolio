-- Run this in Supabase Dashboard > SQL Editor
-- Creates missing tables + RLS policies for all tables

-- ========================================
-- 1. MISSING TABLES (hero_content, site_settings)
-- ========================================

CREATE TABLE IF NOT EXISTS public.hero_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  headline text NOT NULL,
  subheadline text,
  cta_primary_label text,
  cta_primary_url text,
  cta_secondary_label text,
  cta_secondary_url text,
  background_variant text DEFAULT 'default',
  display boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT hero_content_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  site_name text,
  site_description text,
  favicon_url text,
  og_image_url text,
  seo_title_template text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

-- ========================================
-- 2. RLS POLICIES for ALL tables
-- ========================================

-- about
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.about;
DROP POLICY IF EXISTS "Admin all" ON public.about;
CREATE POLICY "Public read" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.about FOR ALL USING (auth.role() = 'authenticated');

-- contact
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.contact;
DROP POLICY IF EXISTS "Admin all" ON public.contact;
CREATE POLICY "Public read" ON public.contact FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.contact FOR ALL USING (auth.role() = 'authenticated');

-- skill_categories
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.skill_categories;
DROP POLICY IF EXISTS "Admin all" ON public.skill_categories;
CREATE POLICY "Public read" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.skill_categories FOR ALL USING (auth.role() = 'authenticated');

-- skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.skills;
DROP POLICY IF EXISTS "Admin all" ON public.skills;
CREATE POLICY "Public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- tools
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.tools;
DROP POLICY IF EXISTS "Admin all" ON public.tools;
CREATE POLICY "Public read" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.tools FOR ALL USING (auth.role() = 'authenticated');

-- experiences
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.experiences;
DROP POLICY IF EXISTS "Admin all" ON public.experiences;
CREATE POLICY "Public read" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');

-- experience_tasks
ALTER TABLE public.experience_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.experience_tasks;
DROP POLICY IF EXISTS "Admin all" ON public.experience_tasks;
CREATE POLICY "Public read" ON public.experience_tasks FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.experience_tasks FOR ALL USING (auth.role() = 'authenticated');

-- projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.projects;
DROP POLICY IF EXISTS "Admin all" ON public.projects;
CREATE POLICY "Public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- project_media
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.project_media;
DROP POLICY IF EXISTS "Admin all" ON public.project_media;
CREATE POLICY "Public read" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_media FOR ALL USING (auth.role() = 'authenticated');

-- project_ctas
ALTER TABLE public.project_ctas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.project_ctas;
DROP POLICY IF EXISTS "Admin all" ON public.project_ctas;
CREATE POLICY "Public read" ON public.project_ctas FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_ctas FOR ALL USING (auth.role() = 'authenticated');

-- project_tools
ALTER TABLE public.project_tools ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.project_tools;
DROP POLICY IF EXISTS "Admin all" ON public.project_tools;
CREATE POLICY "Public read" ON public.project_tools FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_tools FOR ALL USING (auth.role() = 'authenticated');

-- testimonials
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.testimonials;
DROP POLICY IF EXISTS "Admin all" ON public.testimonials;
CREATE POLICY "Public read" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- hero_content
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.hero_content;
DROP POLICY IF EXISTS "Admin all" ON public.hero_content;
CREATE POLICY "Public read" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.hero_content FOR ALL USING (auth.role() = 'authenticated');

-- site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.site_settings;
DROP POLICY IF EXISTS "Admin all" ON public.site_settings;
CREATE POLICY "Public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- education
CREATE TABLE IF NOT EXISTS public.education (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field_of_study text,
  start_date date NOT NULL,
  end_date date,
  gpa text,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT education_pkey PRIMARY KEY (id)
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON public.education;
DROP POLICY IF EXISTS "Admin all" ON public.education;
CREATE POLICY "Public read" ON public.education FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.education FOR ALL USING (auth.role() = 'authenticated');

-- ========================================
-- 7. STORAGE BUCKET
-- ========================================
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete" ON storage.objects;
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
