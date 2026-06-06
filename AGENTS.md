<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Portfolio Project Ground Rules

## 1. Styling: globals.css is the only source of truth

- NO hardcoded colors, font stacks, spacing values, shadows, or borders in any component, page, or config file.
- All design tokens must be defined as CSS custom properties in `globals.css` (`:root` for light, `.dark` for dark).
- `tailwind.config.ts` or `@theme` in globals.css must reference these CSS variables.
- Components must only use Tailwind semantic utility classes: `bg-background`, `text-primary`, `font-heading`, `border-border`, etc.
- Tailwind's built-in spacing scale (`p-4`, `gap-6`, etc.) is allowed.

## 2. Data: All content from Supabase

- No hardcoded content in any component. No mock data, no fallback strings.
- Every piece of visible content must be fetched from Supabase.
- Use Next.js Server Components for data fetching where possible.

## 3. Component architecture

- Every component in `src/components/` organized by domain: `layout/`, `sections/`, `project/`, `ui/`, `animations/`, `admin/`.
- Components must be reusable — props-driven, no hardcoded content.
- Extract shared logic into custom hooks (`src/hooks/`), not duplicated across components.
- If a pattern appears twice, abstract it. No redundant code.

## 4. Project structure

- `src/app/` — only route pages (`page.tsx`, `layout.tsx`). No business logic — just composition.
- `src/components/` — all rendering logic.
- `src/lib/` — all utilities, helpers, Supabase clients.
- `src/hooks/` — all custom hooks.
- `src/types/` — all TypeScript types/interfaces.
- `src/data/` — only truly static config (nav links, route config). Never content.

## 5. Admin panel

- Embedded at `/admin/*` routes.
- Protected by Supabase Auth (email + password).
- TipTap for project content editing.

## 6. Icons

- Use `react-icons` — Simple Icons for tech/brand logos, Lucide for UI icons.
- No emojis anywhere.
- Icons only where functional, never decorative.

## 7. Animations

- Framer Motion: scroll reveals, page transitions.
- GSAP: parallax, mouse tracking, hero text reveals, cursor follower.

## 8. Code style

- Zero emojis in any file — code, comments, commit messages.
- Comments only when explaining why something exists (never what).
- No AI-generated placeholder text, no lorem ipsum.

## 9. Visual design reference

- Read `VISUAL.md` before styling any component. It contains the complete design system: colors, typography, spacing, component patterns, and animation guidelines.
- All component styling must follow the patterns documented there.

## 10. What not to do

- Never write inline styles or style objects in components.
- Never import fonts in layout.tsx with hardcoded weights — use `next/font`.
- Never add new colors without adding them to globals.css first.
- Never hardcode content strings.
