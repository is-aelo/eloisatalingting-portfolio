-- Run this in Supabase Dashboard > SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ABOUT
CREATE TABLE IF NOT EXISTS public.about (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  title text NOT NULL,
  location text,
  profile_image_url text,
  summary text,
  resume_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT about_pkey PRIMARY KEY (id)
);
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.about FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.about FOR ALL USING (auth.role() = 'authenticated');

-- 2. CONTACT
CREATE TABLE IF NOT EXISTS public.contact (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text,
  linkedin_url text,
  github_url text,
  tiktok_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contact_pkey PRIMARY KEY (id)
);
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.contact FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.contact FOR ALL USING (auth.role() = 'authenticated');

-- 3. SKILL CATEGORIES
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT skill_categories_pkey PRIMARY KEY (id)
);
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.skill_categories FOR ALL USING (auth.role() = 'authenticated');

-- 4. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category_id uuid,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT skills_pkey PRIMARY KEY (id),
  CONSTRAINT skills_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.skill_categories(id)
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- 5. TOOLS
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text,
  category text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tools_pkey PRIMARY KEY (id)
);
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.tools FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.tools FOR ALL USING (auth.role() = 'authenticated');

-- 6. EXPERIENCES
CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  role_title text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  currently_working boolean NOT NULL DEFAULT false,
  company_url text,
  summary text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT experiences_pkey PRIMARY KEY (id)
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');

-- 7. EXPERIENCE TASKS
CREATE TABLE IF NOT EXISTS public.experience_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL,
  task text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT experience_tasks_pkey PRIMARY KEY (id),
  CONSTRAINT experience_tasks_experience_id_fkey FOREIGN KEY (experience_id) REFERENCES public.experiences(id)
);
ALTER TABLE public.experience_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.experience_tasks FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.experience_tasks FOR ALL USING (auth.role() = 'authenticated');

-- 8. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  short_description text,
  client_name text,
  project_type text,
  role text,
  start_date date,
  end_date date,
  featured boolean NOT NULL DEFAULT false,
  display boolean NOT NULL DEFAULT true,
  thumbnail_url text,
  cover_image_url text,
  tech_stack_summary text,
  content_md text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- 9. PROJECT MEDIA
CREATE TABLE IF NOT EXISTS public.project_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  media_type text NOT NULL CHECK (media_type = ANY (ARRAY['image'::text, 'video'::text, 'youtube'::text, 'vimeo'::text, 'gif'::text])),
  media_url text NOT NULL,
  alt_text text,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_media_pkey PRIMARY KEY (id),
  CONSTRAINT project_media_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_media FOR ALL USING (auth.role() = 'authenticated');

-- 10. PROJECT CTAS
CREATE TABLE IF NOT EXISTS public.project_ctas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  label text NOT NULL,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT project_ctas_pkey PRIMARY KEY (id),
  CONSTRAINT project_ctas_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
ALTER TABLE public.project_ctas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.project_ctas FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_ctas FOR ALL USING (auth.role() = 'authenticated');

-- 11. PROJECT TOOLS (junction)
CREATE TABLE IF NOT EXISTS public.project_tools (
  project_id uuid NOT NULL,
  tool_id uuid NOT NULL,
  CONSTRAINT project_tools_pkey PRIMARY KEY (project_id, tool_id),
  CONSTRAINT project_tools_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_tools_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.tools(id)
);
ALTER TABLE public.project_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.project_tools FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.project_tools FOR ALL USING (auth.role() = 'authenticated');

-- 12. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  role text,
  avatar_url text,
  testimonial text NOT NULL,
  display boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.testimonials FOR ALL USING (auth.role() = 'authenticated');

-- 13. HERO CONTENT
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
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.hero_content FOR ALL USING (auth.role() = 'authenticated');

-- 14. SITE SETTINGS
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
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin all" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
