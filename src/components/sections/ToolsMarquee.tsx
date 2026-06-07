type Tool = {
  name: string;
  logo_url: string | null;
  category: string | null;
};

export function ToolsMarquee({ tools }: { tools: Tool[] }) {
  if (!tools.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-sm text-muted uppercase tracking-wider">Tools & Tech</p>
        <h2 className="mt-2 font-heading text-3xl text-primary md:text-4xl">Stack I work with</h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {tools.map((tool, i) => (
            <span key={i} className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-secondary transition-colors hover:border-accent-secondary/30">
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
