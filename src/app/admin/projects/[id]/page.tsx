import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectForm projectId={id} />;
}
