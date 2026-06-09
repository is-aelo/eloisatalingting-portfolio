export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { ProjectCardStack } from "@/components/project/ProjectCardStack";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("slug, title, short_description, thumbnail_url, cover_image_url, project_type, tech_stack_summary, project_ctas(label, url)")
    .eq("display", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  return <ProjectCardStack projects={projects ?? []} />;
}
