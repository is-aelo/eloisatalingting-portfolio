export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: hero }, { data: tools }, { data: about }, { data: education }, { data: experiences }, { data: categories }, { data: skills }, { data: projects }, { data: contact }, { data: processSteps }] =
    await Promise.all([
      supabase.from("hero_content").select("*").eq("display", true).maybeSingle(),
      supabase.from("tools").select("name, logo_url, category").order("sort_order"),
      supabase.from("about").select("full_name, title, location, profile_image_url, resume_url, summary").maybeSingle(),
      supabase.from("education").select("id, institution, degree, field_of_study, start_date, end_date").order("start_date", { ascending: false }),
      supabase.from("experiences").select("id, company_name, role_title, start_date, end_date, currently_working, summary").order("start_date", { ascending: false }),
      supabase.from("skill_categories").select("id, name").order("sort_order"),
      supabase.from("skills").select("id, category_id, name").order("sort_order"),
      supabase.from("projects").select("slug, title, short_description, cover_image_url, thumbnail_url, project_type, tech_stack_summary, github_url, project_ctas(label, url)").eq("display", true).order("featured", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("contact").select("email, linkedin_url, github_url, tiktok_url").maybeSingle(),
      supabase.from("process_steps").select("id, step_number, title, description").order("sort_order"),
    ]);

  const fullName = about?.full_name ?? "";
  const role = about?.title ?? null;
  const location = about?.location ?? null;
  const summary = about?.summary ?? null;
  const profileImageUrl = about?.profile_image_url ?? null;

  const skillGroups = (categories ?? []).map((cat) => ({
    category: cat.name,
    items: (skills ?? []).filter((s) => s.category_id === cat.id).map((s) => s.name),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <HeroSection
        hero={hero}
        tools={tools ?? []}
        fullName={fullName}
        role={role}
        location={location}
        summary={summary}
        projects={projects ?? []}
        contact={contact}
        resumeUrl={about?.resume_url ?? null}
      />
      <AboutSection
        skillGroups={skillGroups}
        tools={tools ?? []}
        education={education ?? []}
        experiences={experiences ?? []}
      />
      <ProcessSection steps={processSteps ?? []} />
      <ContactSection email={contact?.email ?? null} linkedinUrl={contact?.linkedin_url ?? null} profileImageUrl={profileImageUrl} />
    </>
  );
}
