type Education = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_date: string;
  end_date: string | null;
};

type Experience = {
  id: string;
  company_name: string;
  role_title: string;
  start_date: string;
  end_date: string | null;
  currently_working: boolean;
};

const fmtY = (s: string) => s.split("-")[0];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtMY = (s: string) => {
  const [y, m] = s.split("-");
  return m ? `${months[parseInt(m) - 1]} ${y}` : y;
};

export function EducationExperience({
  education,
  experiences,
}: {
  education: Education[];
  experiences: Experience[];
}) {
  if (!education.length && !experiences.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-12">
          {/* Experience — left */}
          {experiences.length > 0 && (
            <div>
              <p className="font-body text-xs text-muted uppercase tracking-wider">Experience</p>
              <div className="mt-6 space-y-6">
                {experiences.slice(0, 2).map((exp) => (
                  <div key={exp.id}>
                    <p className="font-heading text-base font-medium text-primary">{exp.role_title}</p>
                    <p className="mt-0.5 text-sm text-secondary">{exp.company_name}</p>
                    <p className="text-sm text-muted">
                      {fmtMY(exp.start_date)} — {exp.currently_working ? "Present" : exp.end_date ? fmtMY(exp.end_date) : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education — right */}
          {education.length > 0 && (
            <div>
              <p className="font-body text-xs text-muted uppercase tracking-wider">Education</p>
              <div className="mt-6 space-y-6">
                {education.slice(0, 2).map((edu) => (
                  <div key={edu.id}>
                    <p className="font-heading text-base font-medium text-primary">{edu.degree}</p>
                    <p className="mt-0.5 text-sm text-secondary">{edu.institution}</p>
                    <p className="text-sm text-muted">
                      {fmtY(edu.start_date)} — {edu.end_date ? fmtY(edu.end_date) : "Present"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
