export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetail } from "@/components/project/ProjectDetail";
import { MoreProjects } from "@/components/project/MoreProjects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("title, short_description, cover_image_url")
    .eq("slug", slug)
    .eq("display", true)
    .single();

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.short_description ?? undefined,
    openGraph: project.cover_image_url
      ? { images: [{ url: project.cover_image_url }] }
      : undefined,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, project_media(*), project_ctas(*)")
    .eq("slug", slug)
    .eq("display", true)
    .single();

  if (!project) notFound();

  const { data: projectTools } = await supabase
    .from("project_tools")
    .select("tool_id")
    .eq("project_id", project.id);

  const toolIds = projectTools?.map((pt) => pt.tool_id) ?? [];
  const { data: tools } =
    toolIds.length > 0
      ? await supabase.from("tools").select("*").in("id", toolIds).order("name")
      : { data: [] };

  const { data: moreProjects } = await supabase
    .from("projects")
    .select("slug, title, short_description, thumbnail_url, project_type, tech_stack_summary")
    .eq("display", true)
    .neq("slug", slug)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <>
      <ProjectDetail project={project as never} tools={tools ?? []} />
      <MoreProjects projects={moreProjects ?? []} />
    </>
  );
}
