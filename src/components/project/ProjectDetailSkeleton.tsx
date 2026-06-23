export function ProjectDetailSkeleton() {
  return (
    <article className="animate-pulse">
      {/* Breadcrumb */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 pt-6 sm:pt-8 md:pt-10">
        <div className="h-4 w-32 rounded bg-surface-muted" />
      </div>

      {/* Cover Image */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 mt-5 sm:mt-6 md:mt-8">
        <div className="h-48 rounded-xl bg-surface-muted sm:h-64 md:h-[40rem]" />
      </div>

      {/* Title & Meta */}
      <div className="mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-8 lg:px-6 mt-8 sm:mt-10 md:mt-14">
        {/* Project type */}
        <div className="h-3 w-20 rounded bg-surface-muted" />

        {/* Title */}
        <div className="mt-4 h-8 w-3/4 rounded bg-surface-muted sm:h-10 md:h-12" />
        <div className="mt-2 h-8 w-1/2 rounded bg-surface-muted sm:h-10 md:h-12" />

        {/* Description */}
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
        </div>

        {/* Meta row */}
        <div className="mt-5 flex gap-4">
          <div className="h-4 w-24 rounded bg-surface-muted" />
          <div className="h-4 w-16 rounded bg-surface-muted" />
          <div className="h-4 w-28 rounded bg-surface-muted" />
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex gap-4">
          <div className="h-12 w-40 rounded-lg bg-surface-muted" />
          <div className="h-12 w-40 rounded-lg bg-surface-muted" />
        </div>

        {/* Tools */}
        <div className="mt-10 border-t border-border pt-10">
          <div className="h-3 w-24 rounded bg-surface-muted" />
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-8 w-20 rounded-full bg-surface-muted" />
            <div className="h-8 w-24 rounded-full bg-surface-muted" />
            <div className="h-8 w-16 rounded-full bg-surface-muted" />
            <div className="h-8 w-28 rounded-full bg-surface-muted" />
            <div className="h-8 w-20 rounded-full bg-surface-muted" />
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-6 md:px-8 lg:px-6 mt-10 sm:mt-14 md:mt-16">
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-11/12 rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-4/5 rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-3/4 rounded bg-surface-muted" />
        </div>

        <div className="mt-12 space-y-3">
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-5/6 rounded bg-surface-muted" />
          <div className="h-4 w-full rounded bg-surface-muted" />
          <div className="h-4 w-2/3 rounded bg-surface-muted" />
        </div>

        {/* Bottom CTA */}
        <div className="mt-12">
          <div className="h-14 w-full rounded-lg bg-surface-muted" />
        </div>
      </div>
    </article>
  );
}
