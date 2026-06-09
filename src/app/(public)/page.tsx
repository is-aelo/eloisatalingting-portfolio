export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { EducationExperience } from "@/components/sections/EducationExperience";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectCardStack } from "@/components/project/ProjectCardStack";
import { ContactSection } from "@/components/sections/ContactSection";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: hero }, { data: tools }, { data: about }, { data: education }, { data: experiences }, { data: categories }, { data: skills }, { data: projects }, { data: contact }] =
    await Promise.all([
      supabase.from("hero_content").select("*").eq("display", true).maybeSingle(),
      supabase.from("tools").select("name, logo_url, category").order("sort_order"),
      supabase.from("about").select("full_name").maybeSingle(),
      supabase.from("education").select("id, institution, degree, field_of_study, start_date, end_date").order("start_date", { ascending: false }),
      supabase.from("experiences").select("id, company_name, role_title, start_date, end_date, currently_working").order("start_date", { ascending: false }),
      supabase.from("skill_categories").select("id, name").order("sort_order"),
      supabase.from("skills").select("id, category_id, name").order("sort_order"),
      supabase.from("projects").select("slug, title, short_description, cover_image_url, thumbnail_url, project_type, tech_stack_summary, project_ctas(label, url)").eq("display", true).order("featured", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("contact").select("email, linkedin_url").maybeSingle(),
    ]);

  const fullName = about?.full_name ?? "";

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
      />
      <ScrollReveal stagger={0.15} selector="[class*='grid'] > *">
        <SkillsSection skillGroups={skillGroups} />
      </ScrollReveal>
      <ScrollReveal>
        <EducationExperience
          education={education ?? []}
          experiences={experiences ?? []}
        />
      </ScrollReveal>
      <ProjectCardStack projects={projects ?? []} />
      <ScrollReveal y={20}>
        <ContactSection email={contact?.email ?? null} linkedinUrl={contact?.linkedin_url ?? null} />
      </ScrollReveal>
    </>  
  );
}
