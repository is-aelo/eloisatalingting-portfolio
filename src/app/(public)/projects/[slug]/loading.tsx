import { ProjectDetailSkeleton } from "@/components/project/ProjectDetailSkeleton";

export default function Loading() {
  return (
    <div className="min-h-dvh bg-background pb-16 md:pb-24">
      <ProjectDetailSkeleton />
    </div>
  );
}
