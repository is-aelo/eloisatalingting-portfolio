import { LuMail } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa6";

type Props = {
  email: string | null;
  linkedinUrl: string | null;
};

export function ContactSection({ email, linkedinUrl }: Props) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-heading text-3xl text-primary md:text-4xl">
          Let&apos;s work together
        </h2>
        <p className="mt-4 text-base leading-relaxed text-secondary md:text-lg">
          From planning and sketch to wireframe and development —
          <br />
          every project starts with an idea and ends with something real.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-6 py-3 font-body text-sm text-background transition-opacity hover:opacity-90"
            >
              <LuMail size={18} />
              Send an email
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3 font-body text-sm text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
            >
              <FaLinkedin size={18} />
              Connect on LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
