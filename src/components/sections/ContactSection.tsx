import { LuMail } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa6";
import { normalizeUrl } from "@/lib/url";

type Props = {
  email: string | null;
  linkedinUrl: string | null;
};

export function ContactSection({ email, linkedinUrl }: Props) {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 md:px-8 lg:px-6 text-center">
        <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Contact</p>

        <h2 className="mt-6 font-heading text-3xl text-primary sm:text-4xl md:text-5xl">
          Let&apos;s build something intentional.
        </h2>

        <p className="mt-4 mx-auto max-w-lg text-sm leading-relaxed text-secondary sm:text-base">
          Great products come from clear thinking, strong design decisions, and solid execution.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent-secondary px-5 py-3 font-body text-sm text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-6 md:px-8 md:py-3.5 md:text-base"
            >
              <LuMail size={18} className="shrink-0" />
              Send an email
            </a>
          )}
          {linkedinUrl && (
            <a
              href={normalizeUrl(linkedinUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 font-body text-sm text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary sm:w-auto sm:px-6 md:px-8 md:py-3.5 md:text-base"
            >
              <FaLinkedin size={18} className="shrink-0" />
              Connect on LinkedIn
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
