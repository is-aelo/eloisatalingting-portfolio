import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Home"
      className="group flex h-10 items-center rounded-lg px-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-11"
    >
      <span className="font-heading text-base font-bold leading-none tracking-tight text-primary transition-colors duration-300 group-hover:text-accent-secondary sm:text-lg">
        eloi<span className="text-accent-secondary">.</span>
      </span>
    </Link>
  );
}