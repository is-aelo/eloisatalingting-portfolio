type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
  gpa: string | null;
  description: string | null;
};

const fmtY = (s: string) => s.split("-")[0];

export function EducationSection({ education }: { education: Education[] }) {
  if (!education.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="font-body text-sm text-muted uppercase tracking-wider">Education</p>

        <div className="mt-10 space-y-10">
          {education.map((edu) => (
            <div key={edu.id} className="grid gap-1 md:grid-cols-[10rem_1fr] md:gap-8">
              <p className="font-body text-sm text-muted">
                {fmtY(edu.start_date)} — {edu.end_date ? fmtY(edu.end_date) : "Present"}
              </p>

              <div>
                <h3 className="font-heading text-xl text-accent-secondary">{edu.degree}</h3>
                {edu.field_of_study && (
                  <p className="mt-0.5 font-body text-sm text-secondary">{edu.field_of_study}</p>
                )}
                <p className="mt-0.5 font-body text-sm text-secondary">{edu.institution}</p>

                {edu.description && (
                  <p className="mt-2 text-base leading-relaxed text-secondary">{edu.description}</p>
                )}

                {edu.gpa && (
                  <p className="mt-1 text-sm text-muted">GPA: {edu.gpa}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
