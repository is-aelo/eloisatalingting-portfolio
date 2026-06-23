type Tool = {
  name: string;
  logo_url: string | null;
  category: string | null;
};

export function TechMarquee({ tools }: { tools: Tool[] }) {
  if (!tools.length) return null;

  const marqueeItems = [...tools, ...tools];

  return (
    <div className="w-full border-y border-border bg-surface-muted/50 py-4">
      <div className="flex items-center gap-4 px-5 sm:px-6 md:px-8 lg:px-6 mb-3">
        <span className="font-body text-[10px] text-accent-secondary uppercase tracking-widest shrink-0 font-medium">
          Technologies
        </span>
        <div className="h-px flex-1 bg-accent-secondary/20" />
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex gap-3 w-fit animate-[marquee_30s_linear_infinite]">
          {marqueeItems.map((tool, i) => (
            <span
              key={`${tool.name}-${i}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/50 bg-surface/80 px-4 py-1.5 font-body text-xs text-secondary backdrop-blur-sm transition-colors hover:border-accent-secondary/30 hover:text-accent-secondary md:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary/40" />
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
