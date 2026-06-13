import { renderTextWithAmpersand } from "@/lib/text";

type SkillGroup = {
  category: string;
  items: string[];
};

export function SkillsSection({ skillGroups }: { skillGroups: SkillGroup[] }) {
  if (!skillGroups.length) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6">
        <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Skills</p>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:gap-10 md:mt-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3">
                <p className="font-heading text-sm sm:text-base font-medium text-primary">{renderTextWithAmpersand(group.category)}</p>
                <div className="h-px flex-1 bg-accent-secondary/20" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block rounded-full bg-surface-muted px-2 py-0.5 font-body text-[10px] text-secondary transition-colors hover:bg-accent-secondary/10 hover:text-accent-secondary sm:px-2.5 sm:py-1 sm:text-[11px] md:px-3 md:py-1 md:text-xs"
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
