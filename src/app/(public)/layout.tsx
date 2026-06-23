import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { InitialPageLoader } from "@/components/animations/InitialPageLoader";
import { SmoothScroll } from "@/components/animations/SmoothScroll";

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
      <InitialPageLoader />
      <SmoothScroll />
      <Header fullName={fullName} contact={contact} resumeUrl={resumeUrl} />
      <PageTransition>
        <main className="min-h-dvh pt-16 md:pt-20">{children}</main>
      </PageTransition>
      <Footer />
    </>
  );
}
