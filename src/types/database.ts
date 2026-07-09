export interface Database {
  public: {
    Tables: {
      about: {
        Row: AboutRow;
        Insert: AboutInsert;
        Update: AboutUpdate;
        Relationships: [];
      };
      contact: {
        Row: ContactRow;
        Insert: ContactInsert;
        Update: ContactUpdate;
        Relationships: [];
      };
      skill_categories: {
        Row: SkillCategoryRow;
        Insert: SkillCategoryInsert;
        Update: SkillCategoryUpdate;
        Relationships: [];
      };
      skills: {
        Row: SkillRow;
        Insert: SkillInsert;
        Update: SkillUpdate;
        Relationships: [];
      };
      tools: {
        Row: ToolRow;
        Insert: ToolInsert;
        Update: ToolUpdate;
        Relationships: [];
      };
      experiences: {
        Row: ExperienceRow;
        Insert: ExperienceInsert;
        Update: ExperienceUpdate;
        Relationships: [];
      };
      experience_tasks: {
        Row: ExperienceTaskRow;
        Insert: ExperienceTaskInsert;
        Update: ExperienceTaskUpdate;
        Relationships: [];
      };
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      project_media: {
        Row: ProjectMediaRow;
        Insert: ProjectMediaInsert;
        Update: ProjectMediaUpdate;
        Relationships: [];
      };
      project_ctas: {
        Row: ProjectCTARow;
        Insert: ProjectCTAInsert;
        Update: ProjectCTAUpdate;
        Relationships: [];
      };
      project_tools: {
        Row: ProjectToolRow;
        Insert: ProjectToolInsert;
        Update: ProjectToolUpdate;
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: TestimonialInsert;
        Update: TestimonialUpdate;
        Relationships: [];
      };
      hero_content: {
        Row: HeroContentRow;
        Insert: HeroContentInsert;
        Update: HeroContentUpdate;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: SiteSettingsInsert;
        Update: SiteSettingsUpdate;
        Relationships: [];
      };
      process_steps: {
        Row: ProcessStepRow;
        Insert: ProcessStepInsert;
        Update: ProcessStepUpdate;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
}

export interface AboutRow {
  id: string;
  full_name: string;
  title: string;
  location: string | null;
  profile_image_url: string | null;
  summary: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AboutInsert {
  id?: string;
  full_name: string;
  title: string;
  location?: string | null;
  profile_image_url?: string | null;
  summary?: string | null;
  resume_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AboutUpdate {
  full_name?: string;
  title?: string;
  location?: string | null;
  profile_image_url?: string | null;
  summary?: string | null;
  resume_url?: string | null;
  updated_at?: string;
}

export interface ContactRow {
  id: string;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  tiktok_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactInsert {
  id?: string;
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ContactUpdate {
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  tiktok_url?: string | null;
  updated_at?: string;
}

export interface SkillCategoryRow {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface SkillCategoryInsert {
  id?: string;
  name: string;
  sort_order?: number;
  created_at?: string;
}

export interface SkillCategoryUpdate {
  name?: string;
  sort_order?: number;
}

export interface SkillRow {
  id: string;
  category_id: string | null;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface SkillInsert {
  id?: string;
  category_id?: string | null;
  name: string;
  sort_order?: number;
  created_at?: string;
}

export interface SkillUpdate {
  category_id?: string | null;
  name?: string;
  sort_order?: number;
}

export interface ToolRow {
  id: string;
  name: string;
  logo_url: string | null;
  category: string | null;
  sort_order: number;
  created_at: string;
}

export interface ToolInsert {
  id?: string;
  name: string;
  logo_url?: string | null;
  category?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface ToolUpdate {
  name?: string;
  logo_url?: string | null;
  category?: string | null;
  sort_order?: number;
}

export interface ExperienceRow {
  id: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  company_url: string | null;
  summary: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceInsert {
  id?: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date?: string | null;
  currently_working?: boolean;
  company_url?: string | null;
  summary?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ExperienceUpdate {
  company_name?: string;
  role_title?: string;
  start_date?: string;
  end_date?: string | null;
  currently_working?: boolean;
  company_url?: string | null;
  summary?: string | null;
  sort_order?: number;
  updated_at?: string;
}

export interface ExperienceTaskRow {
  id: string;
  experience_id: string;
  task: string;
  sort_order: number;
  created_at: string;
}

export interface ExperienceTaskInsert {
  id?: string;
  experience_id: string;
  task: string;
  sort_order?: number;
  created_at?: string;
}

export interface ExperienceTaskUpdate {
  task?: string;
  sort_order?: number;
}

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  client_name: string | null;
  project_type: string | null;
  role: string | null;
  start_date: string | null;
  end_date: string | null;
  featured: boolean;
  display: boolean;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  tech_stack_summary: string | null;
  content_md: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  slug: string;
  title: string;
  short_description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  featured?: boolean;
  display?: boolean;
  thumbnail_url?: string | null;
  cover_image_url?: string | null;
  tech_stack_summary?: string | null;
  content_md?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectUpdate {
  slug?: string;
  title?: string;
  short_description?: string | null;
  client_name?: string | null;
  project_type?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  featured?: boolean;
  display?: boolean;
  thumbnail_url?: string | null;
  cover_image_url?: string | null;
  tech_stack_summary?: string | null;
  content_md?: string | null;
  updated_at?: string;
}

export interface ProjectMediaRow {
  id: string;
  project_id: string;
  media_type: "image" | "video" | "youtube" | "vimeo" | "gif";
  media_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProjectMediaInsert {
  id?: string;
  project_id: string;
  media_type: "image" | "video" | "youtube" | "vimeo" | "gif";
  media_url: string;
  alt_text?: string | null;
  caption?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface ProjectMediaUpdate {
  media_type?: "image" | "video" | "youtube" | "vimeo" | "gif";
  media_url?: string;
  alt_text?: string | null;
  caption?: string | null;
  sort_order?: number;
}

export interface ProjectCTARow {
  id: string;
  project_id: string;
  label: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface ProjectCTAInsert {
  id?: string;
  project_id: string;
  label: string;
  url: string;
  sort_order?: number;
  created_at?: string;
}

export interface ProjectCTAUpdate {
  label?: string;
  url?: string;
  sort_order?: number;
}

export interface ProjectToolRow {
  project_id: string;
  tool_id: string;
}

export interface ProjectToolInsert {
  project_id: string;
  tool_id: string;
}

export interface ProjectToolUpdate {
  project_id?: string;
  tool_id?: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  avatar_url: string | null;
  testimonial: string;
  display: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TestimonialInsert {
  id?: string;
  name: string;
  company?: string | null;
  role?: string | null;
  avatar_url?: string | null;
  testimonial: string;
  display?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TestimonialUpdate {
  name?: string;
  company?: string | null;
  role?: string | null;
  avatar_url?: string | null;
  testimonial?: string;
  display?: boolean;
  sort_order?: number;
  updated_at?: string;
}

export interface HeroContentRow {
  id: string;
  headline: string;
  subheadline: string | null;
  cta_primary_label: string | null;
  cta_primary_url: string | null;
  cta_secondary_label: string | null;
  cta_secondary_url: string | null;
  background_variant: string | null;
  display: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroContentInsert {
  id?: string;
  headline: string;
  subheadline?: string | null;
  cta_primary_label?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_label?: string | null;
  cta_secondary_url?: string | null;
  background_variant?: string | null;
  display?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HeroContentUpdate {
  headline?: string;
  subheadline?: string | null;
  cta_primary_label?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_label?: string | null;
  cta_secondary_url?: string | null;
  background_variant?: string | null;
  display?: boolean;
  updated_at?: string;
}

export interface EducationRow {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  gpa: string | null;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EducationInsert {
  id?: string;
  institution: string;
  degree: string;
  field_of_study?: string | null;
  start_date: string;
  end_date?: string | null;
  gpa?: string | null;
  description?: string | null;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EducationUpdate {
  institution?: string;
  degree?: string;
  field_of_study?: string | null;
  start_date?: string;
  end_date?: string | null;
  gpa?: string | null;
  description?: string | null;
  order_index?: number;
  updated_at?: string;
}

export interface SiteSettingsRow {
  id: string;
  site_name: string | null;
  site_description: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
  seo_title_template: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSettingsInsert {
  id?: string;
  site_name?: string | null;
  site_description?: string | null;
  favicon_url?: string | null;
  og_image_url?: string | null;
  seo_title_template?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettingsUpdate {
  site_name?: string | null;
  site_description?: string | null;
  favicon_url?: string | null;
  og_image_url?: string | null;
  seo_title_template?: string | null;
  updated_at?: string;
}

export interface ProcessStepRow {
  id: string;
  step_number: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProcessStepInsert {
  id?: string;
  step_number: number;
  title: string;
  description: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessStepUpdate {
  step_number?: number;
  title?: string;
  description?: string;
  sort_order?: number;
  updated_at?: string;
}
