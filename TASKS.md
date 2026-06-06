# Build Phases

## Phase 1 — Project Scaffold
- [x] Next.js 16 scaffold (TS, App Router, Tailwind v4)
- [x] Install deps: Supabase, Framer Motion, GSAP, react-icons
- [x] Design tokens in `globals.css` (light + dark via `:root` / `[data-theme]`)
- [x] Fonts: Rethink Sans (headings) + DM Sans (body) via `next/font`
- [x] Supabase client helpers: `client.ts`, `server.ts`, `admin.ts`
- [x] Database types in `src/types/database.ts`
- [x] Theme system: inline script + `useTheme` hook + `ThemeToggle`
- [x] `.env.local` with Supabase credentials
- [x] `AGENTS.md` + `VISUAL.md` + `TASKS.md`

## Phase 2 — Admin Panel
- [x] Install TipTap + admin dependencies
- [x] `/admin/login` — Supabase Auth (email + password)
- [x] `/admin` layout with sidebar + auth guard
- [x] TipTap editor for `projects.content_md`
- [x] CRUD: hero, about, skills, tools, experiences, projects, testimonials, settings
- [x] Image upload to Supabase Storage

## Phase 3 — Layout Shell
- [ ] `Header` component (nav links, theme toggle)
- [ ] `Footer` component
- [ ] `MobileNav` component
- [ ] Root layout refinements
- [ ] Page transition wrapper

## Phase 4 — Supabase Service Layer
- [ ] Query functions for all tables
- [ ] Server component data fetching patterns
- [ ] RLS policies setup (if needed)

## Phase 5 — Home Page
- [ ] `HeroSection` (GSAP text reveal + parallax background)
- [ ] `FeaturedProjects` section
- [ ] `AboutPreview` section
- [ ] `SkillsShowcase` section
- [ ] `ContactPreview` section

## Phase 6 — Projects + Case Studies
- [ ] `/projects` gallery page with filtering
- [ ] `ProjectCard` component
- [ ] `/projects/[slug]` case study page
- [ ] TipTap content rendering via `react-markdown`

## Phase 7 — About, Resume, Contact Pages
- [ ] `/about` page (bio, skills, tools, experience timeline)
- [ ] `/resume` page (web + PDF download)
- [ ] `/contact` page (form + social links)

## Phase 8 — Animations
- [ ] `ScrollReveal` (Framer Motion)
- [ ] `ParallaxTilt` (GSAP 3D tilt)
- [ ] `MouseParallax` (GSAP)
- [ ] `CursorFollower` (GSAP lerp)
- [ ] Page transitions (Framer Motion `AnimatePresence`)

## Phase 9 — Polish & Launch
- [ ] SEO metadata, OG images
- [ ] Performance audit
- [ ] Deployment prep
