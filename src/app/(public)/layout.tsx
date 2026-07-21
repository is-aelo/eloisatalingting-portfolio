import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/animations/PageTransition";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { CursorFollower } from "@/components/animations/CursorFollower";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <div className="hidden lg:block"><CursorFollower shape="ring-dot" size={32} /></div>
      <Header />
      <div className="flex min-h-dvh flex-col pb-20">
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </div>
    </>
  );
}
