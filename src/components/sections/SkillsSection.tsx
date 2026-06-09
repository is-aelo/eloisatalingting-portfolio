type SkillGroup = {
  category: string;
  items: string[];
};

export function SkillsSection({ skillGroups }: { skillGroups: SkillGroup[] }) {
  if (!skillGroups.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-xs text-muted uppercase tracking-wider">Skills</p>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <p className="font-heading text-sm font-medium text-primary">{group.category}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
