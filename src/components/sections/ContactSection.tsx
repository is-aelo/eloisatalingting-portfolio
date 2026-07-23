"use client";

import { useState } from "react";
import { LuMail } from "react-icons/lu";
import { FaLinkedin } from "react-icons/fa6";
import { normalizeUrl } from "@/lib/url";

type Props = {
  email: string | null;
  linkedinUrl: string | null;
  profileImageUrl?: string | null;
};

export function ContactSection({ email, linkedinUrl, profileImageUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Contact</p>

        {profileImageUrl && (
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl border border-accent-secondary/20" />
              <img
                src={profileImageUrl}
                alt="Profile"
                className="relative block w-full max-w-[240px] rounded-xl border border-border object-cover shadow-sm lg:w-52 xl:w-64 aspect-square"
              />
            </div>
          </div>
        )}

        <h2 className="mt-6 font-heading font-bold text-2xl text-primary sm:text-3xl md:text-4xl tracking-tight">
          Got a site that needs designing and building?
        </h2>

        <p className="mt-4 mx-auto max-w-lg text-sm leading-relaxed text-secondary sm:text-base">
          That&apos;s usually split between two people. I do both &mdash; and you can see the results above.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-start justify-center gap-3">
          {email && (
            <div className="flex flex-col items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-body text-sm text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-6 md:px-8 md:py-3.5 md:text-base"
              >
                <LuMail size={18} className="shrink-0" />
                Send an email
              </a>
              <button
                onClick={handleCopyEmail}
                className="cursor-pointer font-body text-xs text-secondary transition-colors hover:text-accent"
              >
                {copied ? "Copied!" : "Copy email address"}
              </button>
            </div>
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