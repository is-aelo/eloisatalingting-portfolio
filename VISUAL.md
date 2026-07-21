# Visual Design System

## Brand Overview

- **Vibe**: Terracotta on deep umber. Warm, earthy, and grounded. Organic luxury with modern confidence.
- **Theme**: Dark-only. No light mode.
- **No emojis anywhere.** Icons only where functional (react-icons: Simple Icons for tech/brand, Lucide for UI).

---

## 1. Color System

All colors are CSS custom properties in `globals.css`. Components only use Tailwind semantic classes derived from these.

Dark mode is class-based: `.dark` on `<html>` toggles all CSS custom properties. The initial theme respects `localStorage` > `prefers-color-scheme`. A `ThemeToggle` button (sun/moon) in the sidebar lets users switch. A flash-prevention script runs inline in `<head>` before hydration.

### Palette

All colors derive from three base tokens. Variants use `color-mix` for transparency.

| Token | Light Value | Dark Value | Usage |
|-------|-------------|------------|-------|
| `--background` | `#faf4ef` | `#1c0e10` | Page background |
| `--surface` | `#faf4ef` | `#1c0e10` | Card, container, elevated areas |
| `--surface-muted` | `color-mix(#1c0e10 8%, #faf4ef)` | `color-mix(#faf4ef 8%, #1c0e10)` | Subtle background variant |
| `--border` | `color-mix(#1c0e10 20%, #faf4ef)` | `color-mix(#faf4ef 20%, #1c0e10)` | Borders, dividers, strokes |
| `--primary` | `#1c0e10` | `#faf4ef` | Main body text, headings |
| `--secondary` | `color-mix(#1c0e10 65%, #faf4ef)` | `color-mix(#faf4ef 65%, #1c0e10)` | Secondary text, labels |
| `--muted` | `color-mix(#1c0e10 45%, #faf4ef)` | `color-mix(#faf4ef 45%, #1c0e10)` | Placeholder, disabled, subtle text |
| `--accent` | `#e45580` | `#e45580` | Buttons, interactive, links |
| `--accent-secondary` | `#e45580` | `#e45580` | Same as accent |
| `--accent-tertiary` | `#e45580` | `#e45580` | Same as accent |
| `--danger` | `#e45580` | `#e45580` | Destructive text, delete buttons |
| `--danger-bg` | `color-mix(#e45580 15%, #faf4ef)` | `color-mix(#e45580 15%, #1c0e10)` | Danger state background |

### Rule

Never use hex codes in components. Always use Tailwind classes:
- `bg-background`, `bg-surface`, `bg-surface-muted`
- `text-primary`, `text-secondary`, `text-muted`
- `text-accent` for links, buttons, interactive elements
- `border-border`
- `hover:text-accent` for interactive hover
- `bg-accent/10` for subtle accent backgrounds
- `text-danger` for destructive text, form errors
- `bg-danger` for destructive button backgrounds
- `bg-danger-bg` for danger state backgrounds

---

## 2. Typography

| Role | Font | CSS Variable | Tailwind Class |
|------|------|-------------|----------------|
| Headings / Titles | Geist Pixel Square | `--font-heading` | `font-heading` — headings only, never on labels/badges/small text |
| Nav links | Geist Pixel Circle | `--font-nav` | `font-nav` — sidebar nav links only |
| Body | Geist Mono | `--font-body` | `font-body` — body, labels, badges, captions, meta text |

### Scale

- **Hero title**: `text-5xl sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem]` `font-heading` `tracking-tight` centered
- **Section heading**: `text-3xl md:text-4xl` `font-heading`
- **Card title**: `text-xl` `font-heading`
- **Nav link**: `font-nav` `text-sm` `uppercase` `tracking-wider`
- **Body**: `text-base` `font-body` `leading-relaxed`
- **Small / meta**: `text-sm` `font-body` `text-muted`
- **Caption / label**: `text-xs` `font-body` `text-muted` `uppercase` `tracking-wider`

### Weights

- Headings: Geist Pixel Square (weight 400 only — hierarchy via size and weight contrast)
- Nav: Geist Pixel Circle (weight 400)
- Body: Geist Mono (weight 400 for body, 500 for emphasis)
- **Rule**: `font-heading` is for headings only — section titles, hero text, card titles, page titles. Never use on labels, badges, captions, meta text, or any element smaller than `text-base`.
- **Rule**: `font-nav` is for navigation links in the sidebar only.

---

## 3. Spacing & Layout

- Use Tailwind's built-in spacing scale (`p-4`, `gap-6`, `py-12`, etc.)
- Section spacing: `py-16` to `py-24` between major sections
- Card padding: `p-6` or `p-8`
- Grid gap: `gap-6` or `gap-8` for project grids
- Max content width: `max-w-6xl` with `px-4` or `px-6`
- Border radius: `rounded-lg` for cards, `rounded-xl` for large containers, `rounded-full` for avatars/badges
- Shadows: `shadow-sm` for subtle elevation. No hardcoded shadow values.

---

## 4. Component Patterns

### Buttons
- Primary: `bg-accent text-white font-body px-6 py-3 rounded-full hover:opacity-90 transition-opacity`
- Secondary/Outline: `border border-border text-primary px-6 py-3 rounded-full hover:border-accent hover:text-accent transition-colors`
- Ghost: `text-secondary hover:text-accent transition-colors`
- Cursor: add `cursor-pointer` on all interactive elements.

### Cards (Project cards, etc.)
- Container: `bg-surface border border-border rounded-xl overflow-hidden`
- Hover: `hover:border-accent/30 transition-colors`
- Image aspect ratio: `aspect-video` or `aspect-4/3` for thumbnails
- No shadow unless specified.

### Navigation (Sidebar)
- Desktop: fixed left sidebar, `w-60`, full height (`h-dvh`), `border-r border-border`, `bg-background`
  - Logo at top, nav links below, resume + socials pinned to bottom
  - Nav link active state: `bg-accent/10 text-accent font-medium`
  - Content offset: `md:ml-60` on `<main>`
- Mobile (<768px): slim top bar (`h-14`) with Logo + hamburger. Drawer slides from left (`w-72`) with backdrop overlay.
  - Content offset: `pt-14` on `<main>`

### Hero Section
- Full-width centered layout (editorial/magazine style)
- Name: `font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] tracking-tight uppercase` centered
- Accent line: `h-0.5 w-16 bg-accent mx-auto` centered below name
- Headline: `font-heading text-lg md:text-xl lg:text-2xl text-accent max-w-2xl mx-auto`
- Subheadline: `text-base md:text-lg text-secondary max-w-xl mx-auto`
- CTA buttons: `mt-8 flex gap-4 justify-center`
- Tech marquee: label "TECHNOLOGIES I WORK WITH" with thin line, scrolling tools below

### Section Layout
- Wrapper: `py-16 md:py-24`
- Inner: `max-w-6xl mx-auto px-6`
- Label: `font-body text-sm text-muted uppercase tracking-wider mb-2`
- Heading: `font-heading text-3xl md:text-4xl mb-8`

### Project Detail (Case Study)
- Hero: cover image with overlay title
- Content area: `max-w-3xl mx-auto` — narrower for readability
- Media: full-width within content, `rounded-xl overflow-hidden`
- Body text: `text-base md:text-lg leading-relaxed text-secondary`

### Tags / Tech Stack
- Container: `flex flex-wrap gap-2`
- Individual tag: `text-xs font-body text-accent bg-accent/10 px-3 py-1 rounded-full`

### Form Inputs (Contact + Admin)
- Input: `w-full bg-surface border border-border rounded-lg px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors`
- Label: `text-sm text-secondary mb-1`
- Error: `text-xs text-danger mt-1`
- Textarea: same as input but `min-h-[120px]`

---

## 5. Animations (High-Level)

Refer to AGENTS.md for library split. Implementation details in components.

- **Framer Motion**: `ScrollReveal` wrapper component for fade-up on scroll. Page transitions with `AnimatePresence`.
- **GSAP**: Hero text reveals, parallax, mouse tracking, cursor follower. GSAP is for heavier timeline-driven animations.
- **Performance**: Animations disabled or reduced on `prefers-reduced-motion`. GSAP animations only on desktop (check `matchMedia`).

---

## 6. Dark/Light Mode Awareness

- Components must look correct in both modes. Test both.
- Use `text-primary`, `text-secondary`, `text-muted` — never hardcode text colors.
- Icons: `text-primary` or `text-secondary`, never hardcoded. Inverted icons not needed — text colors handle contrast.
- Images: no hardcoded white/black backgrounds. If an image has transparency, it works in both modes.

---

## 7. Responsive Design

Every component and layout must be fully responsive across all screen sizes — from 320px mobile to 1920px+ desktop. No element should overflow, clip, overlap, or appear broken at any viewport width.

### Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Target |
|---|---|---|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |

### Core rules

1. **Change layout when necessary** — don't just stack vertically at every breakpoint. Use `md:flex-row`, `lg:grid-cols-3`, etc. to create proper layouts that adapt.
2. **Grids must reflow** — never hardcode a single column for all sizes. Always define column counts per breakpoint (e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`).
3. **Text must reflow** — headings should scale down on mobile (`text-3xl md:text-5xl`). Long text should never overflow or cause horizontal scroll.
4. **Touch targets** — buttons, links, and interactive elements must be at least 44px tall on mobile for touch. Use `py-3` or larger.
5. **No horizontal scroll** — any element wider than the viewport is a bug. Use `overflow-hidden` only as a last resort; prefer responsive widths (`w-full`, `max-w-full`, `grid-cols-1`).
6. **Images** — always `w-full h-auto` or `object-cover` with explicit aspect ratio. Never fixed pixel widths.
7. **Side-by-side content** — on mobile, collapse side-by-side layouts (flex row to column, grid multi-col to single col).
8. **Padding/margins** — reduce outer padding on mobile (`px-4 sm:px-6`) so content fills the full width on small screens.
9. **Navigation** — desktop horizontal nav to mobile hamburger menu. Footer links: row on desktop, wrap or column on mobile.

### Testing

Check every component at: 320px, 375px, 640px, 768px, 1024px, 1280px, 1440px.
No overflowing text, no broken grids, no elements clipped by containers, no awkward gaps.

---

## 8. Icons

- Import from `react-icons`:
  - Tech/brand logos: `import { SiReact, SiFigma } from "react-icons/si"`
  - UI icons: `import { LuSun, LuMoon } from "react-icons/lu"`
- Sizing: `size={20}` for inline, `size={24}` for larger UI icons
- Color: inherit parent text color by default, or use `className="text-accent"`
- All interactive icons need `aria-label` for accessibility.
