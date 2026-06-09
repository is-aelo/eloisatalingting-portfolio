export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetail } from "@/components/project/ProjectDetail";

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

  return <ProjectDetail project={project as never} />;
}
