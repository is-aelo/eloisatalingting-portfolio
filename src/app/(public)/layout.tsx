import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CursorFollower } from "@/components/animations/CursorFollower";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: about }, { data: contact }] = await Promise.all([
    supabase.from("about").select("full_name, resume_url").maybeSingle(),
    supabase.from("contact").select("email, linkedin_url, github_url, tiktok_url").maybeSingle(),
  ]);

  const fullName = about?.full_name ?? "Portfolio";
  const resumeUrl = about?.resume_url ?? null;

  return (
    <>
      <SmoothScroll />
      <CursorFollower shape="ring-dot" size={32} />
      <Sidebar fullName={fullName} contact={contact} resumeUrl={resumeUrl} />
      <div className="flex min-h-dvh flex-col pt-20 lg:pt-8 lg:ml-60">
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </div>
    </>
  );
}
