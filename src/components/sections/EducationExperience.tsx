import { renderTextWithAmpersand } from "@/lib/text";

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
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 md:px-8 lg:px-6">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
          {/* Experience — left */}
          {experiences.length > 0 && (
            <div>
              <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Experience</p>
              <div className="relative mt-5 space-y-7 sm:mt-6 sm:space-y-8 md:space-y-8">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                {experiences.slice(0, 3).map((exp) => (
                  <div key={exp.id} className="relative pl-7 sm:pl-8">
                    <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-accent-secondary bg-background" />
                    <p className="font-heading text-sm sm:text-base font-medium text-primary">{renderTextWithAmpersand(exp.role_title)}</p>
                    <p className="mt-0.5 text-xs sm:text-sm text-secondary">{exp.company_name}</p>
                    <p className="mt-1 text-[10px] sm:text-xs text-primary/80">
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
              <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Education</p>
              <div className="relative mt-5 space-y-7 sm:mt-6 sm:space-y-8 md:space-y-8">
                <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border" />
                {education.slice(0, 3).map((edu) => (
                  <div key={edu.id} className="relative pl-7 sm:pl-8">
                    <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-accent-tertiary bg-background" />
                    <p className="font-heading text-sm sm:text-base font-medium text-primary">{renderTextWithAmpersand(edu.degree)}</p>
                    <p className="mt-0.5 text-xs sm:text-sm text-secondary">{edu.institution}</p>
                    <p className="mt-1 text-[10px] sm:text-xs text-primary/80">
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
