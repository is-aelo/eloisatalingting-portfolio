import { LuArrowUpRight } from "react-icons/lu";

type Experience = {
  id: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
  company_url: string | null;
  summary: string | null;
  tasks?: { task: string }[];
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMY = (s: string) => {
  const [y, m] = s.split("-");
  return m ? `${months[parseInt(m) - 1]} ${y}` : y;
};

export function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  if (!experiences.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-sm text-muted uppercase tracking-wider">Experience</p>

        <div className="mt-10 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="grid gap-1 md:grid-cols-[10rem_1fr] md:gap-8">
              <p className="font-body text-sm text-muted">
                {fmtMY(exp.start_date)} — {exp.currently_working ? "Present" : exp.end_date ? fmtMY(exp.end_date) : ""}
              </p>

              <div>
                  <h3 className="font-heading text-xl text-accent-secondary">{exp.role_title}</h3>
                  {exp.company_url ? (
                    <a
                      href={exp.company_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex cursor-pointer items-center gap-1 font-body text-sm text-secondary transition-opacity hover:text-accent-secondary"
                    >
                      {exp.company_name} <LuArrowUpRight size={14} />
                    </a>
                  ) : (
                    <p className="mt-0.5 font-body text-sm text-secondary">{exp.company_name}</p>
                  )}

                {exp.summary && (
                  <p className="mt-2 text-base leading-relaxed text-secondary">{exp.summary}</p>
                )}

                {exp.tasks && exp.tasks.length > 0 && (
                  <ul className="mt-3 flex list-disc flex-col gap-1 pl-5 text-sm text-secondary">
                    {exp.tasks.map((t, i) => (
                      <li key={i}>{t.task}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
