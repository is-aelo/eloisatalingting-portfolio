"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
};

type Props = {
  steps: ProcessStep[];
};

export function ProcessSection({ steps }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = sectionRef.current?.querySelectorAll(".process-row");
    if (!rows || rows.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(rows, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 24,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (steps.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Process</p>

        <h2 className="mt-6 font-heading font-bold text-2xl text-primary sm:text-3xl tracking-tight">
          From concept to launch
        </h2>

        <div className="mt-10 grid grid-cols-1 border border-border sm:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`process-row group flex flex-col gap-3 px-6 py-6 transition-colors hover:bg-surface-muted md:px-8 md:py-8 ${
                i % 3 !== 2 ? "border-r border-border" : ""
              } ${
                i < steps.length - 3 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-accent/40 transition-colors group-hover:w-8 group-hover:bg-accent" />
                <span className="font-heading text-xl text-accent/60 transition-colors group-hover:text-accent md:text-2xl">
                  {String(step.step_number).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-heading text-base font-medium text-primary sm:text-lg">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
