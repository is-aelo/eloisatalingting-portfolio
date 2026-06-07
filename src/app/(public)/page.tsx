import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ToolsMarquee } from "@/components/sections/ToolsMarquee";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [{ data: hero }, { data: about }, experiencesResult, educationResult, projectsResult, toolsResult] = await Promise.all([
    supabase.from("hero_content").select("*").maybeSingle(),
    supabase.from("about").select("full_name").maybeSingle(),
    supabase.from("experiences").select("*").order("sort_order", { ascending: true }),
    supabase.from("education").select("*").order("order_index", { ascending: true }),
    supabase.from("projects").select("slug, title, short_description, project_type, thumbnail_url, tech_stack_summary").eq("featured", true).eq("display", true).order("created_at", { ascending: false }),
    supabase.from("tools").select("name, logo_url, category").order("sort_order", { ascending: true }),
  ]);

  const experiences = experiencesResult.data ?? [];
  const education = educationResult.data ?? [];

  let experienceIds = experiences.map((e) => e.id);
  let tasksByExp: Record<string, { task: string }[]> = {};
  if (experienceIds.length > 0) {
    const { data: tasks } = await supabase
      .from("experience_tasks")
      .select("experience_id, task")
      .in("experience_id", experienceIds)
      .order("sort_order", { ascending: true });

    if (tasks) {
      for (const t of tasks) {
        if (!tasksByExp[t.experience_id]) tasksByExp[t.experience_id] = [];
        tasksByExp[t.experience_id].push({ task: t.task });
      }
    }
  }

  const experiencesWithTasks = experiences.map((e) => ({
    ...e,
    tasks: tasksByExp[e.id] ?? [],
  }));

  return (
    <>
      <HeroSection content={hero} fullName={about?.full_name} />
      <ExperienceSection experiences={experiencesWithTasks} />
      <EducationSection education={education} />
      <FeaturedProjects projects={projectsResult.data ?? []} />
      <ToolsMarquee tools={toolsResult.data ?? []} />
    </>
  );
}
