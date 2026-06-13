export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectCardStack } from "@/components/project/ProjectCardStack";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: hero }, { data: tools }, { data: about }, { data: education }, { data: experiences }, { data: categories }, { data: skills }, { data: projects }, { data: contact }] =
    await Promise.all([
      supabase.from("hero_content").select("*").eq("display", true).maybeSingle(),
      supabase.from("tools").select("name, logo_url, category").order("sort_order"),
      supabase.from("about").select("full_name, location").maybeSingle(),
      supabase.from("education").select("id, institution, degree, field_of_study, start_date, end_date").order("start_date", { ascending: false }),
      supabase.from("experiences").select("id, company_name, role_title, start_date, end_date, currently_working, summary").order("start_date", { ascending: false }),
      supabase.from("skill_categories").select("id, name").order("sort_order"),
      supabase.from("skills").select("id, category_id, name").order("sort_order"),
      supabase.from("projects").select("slug, title, short_description, cover_image_url, thumbnail_url, project_type, tech_stack_summary, project_ctas(label, url)").eq("display", true).order("featured", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("contact").select("email, linkedin_url").maybeSingle(),
    ]);

  const fullName = about?.full_name ?? "";
  const location = about?.location ?? null;

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
        location={location}
      />
      <AboutSection
        skillGroups={skillGroups}
        tools={tools ?? []}
        education={education ?? []}
        experiences={experiences ?? []}
      />
      <ProjectCardStack projects={projects ?? []} />
      <ContactSection email={contact?.email ?? null} linkedinUrl={contact?.linkedin_url ?? null} />
    </>
  );
}
