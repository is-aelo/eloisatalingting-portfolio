import { LuMail } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa6";

type Props = {
  email: string | null;
  linkedinUrl: string | null;
};

export function ContactSection({ email, linkedinUrl }: Props) {
  return (
    <section id="contact" className="pt-20 pb-16 md:pt-28 md:pb-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2           className="font-heading text-4xl font-bold text-primary md:text-5xl">
          Let&apos;s work together
        </h2>
        <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
          From planning and sketch to wireframe and development —
          <br />
          every project starts with an idea and ends with something real.
        </p>
        <div className="mt-8 flex flex-nowrap items-center justify-center gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-body text-xs text-background transition-opacity hover:opacity-90 md:px-6 md:py-3 md:text-sm"
            >
              <LuMail size={16} className="shrink-0 md:size-[18px]" />
              Send an email
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-body text-xs text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary md:px-6 md:py-3 md:text-sm"
            >
              <FaLinkedin size={16} className="shrink-0 md:size-[18px]" />
              Connect on LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
