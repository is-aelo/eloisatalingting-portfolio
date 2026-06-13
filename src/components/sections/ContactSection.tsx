import { LuMail } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa6";
import { renderTextWithAmpersand } from "@/lib/text";

type Props = {
  email: string | null;
  linkedinUrl: string | null;
};

export function ContactSection({ email, linkedinUrl }: Props) {
  return (
    <section id="contact" className="pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
      <div className="mx-auto max-w-2xl px-5 sm:px-6 md:px-8 lg:px-6 text-center">
        <div className="mx-auto mb-5 h-0.5 w-12 bg-accent-secondary sm:mb-6" />
        <h2 className="font-heading text-3xl text-primary sm:text-4xl md:text-5xl lg:text-6xl">
          Let&apos;s build something intentional.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-secondary sm:mt-5 sm:text-base md:text-lg">
          Great products come from clear thinking, strong design decisions, and solid execution.<br />
          If it makes sense to work together, I&apos;m one message away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          {email && (
            <a
              href={`mailto:${email}`}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-secondary px-5 py-2.5 font-body text-sm text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-6 sm:py-3 md:px-8 md:py-3.5 md:text-base"
            >
              <LuMail size={18} className="shrink-0" />
              Send an email
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-5 py-2.5 font-body text-sm text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary sm:w-auto sm:px-6 sm:py-3 md:px-8 md:py-3.5 md:text-base"
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
