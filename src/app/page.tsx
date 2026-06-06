import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: about } = await supabase
    .from("about")
    .select("full_name, title, location")
    .maybeSingle();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2">
      {about ? (
        <>
          <h1 className="font-heading text-4xl text-primary">{about.full_name}</h1>
          <p className="text-lg text-secondary">{about.title}</p>
          {about.location && (
            <p className="text-sm text-muted">{about.location}</p>
          )}
        </>
      ) : (
        <p className="text-muted">No data found. Add a row to the `about` table.</p>
      )}
    </main>
  );
}
