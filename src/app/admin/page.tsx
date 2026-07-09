import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const tables = ["hero_content", "about", "skills", "tools", "experiences", "projects", "testimonials", "process_steps"] as const;
  const counts: Record<string, number> = {};

  for (const table of tables) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    counts[table] = count ?? 0;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl text-primary">Dashboard</h1>
      <p className="mt-1 text-secondary">Overview of your portfolio content</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(counts).map(([table, count]) => (
          <div
            key={table}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <p className="text-sm text-muted">
              {table.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </p>
            <p className="mt-1 font-heading text-3xl text-primary">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
