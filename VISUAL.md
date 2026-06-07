# Visual Design System

## Brand Overview

- **Vibe**: Senior-level, clean, sophisticated. Not junior, not trendy.
- **Theme**: Dark/light with system preference detection. Manual toggle available.
- **No emojis anywhere.** Icons only where functional (react-icons: Simple Icons for tech/brand, Lucide for UI).

---

## 1. Color System

All colors are CSS custom properties in `globals.css`. Components only use Tailwind semantic classes derived from these.

### Light Mode (`:root, [data-theme="light"]`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#fafaf9` | Page background |
| `--surface` | `#ffffff` | Card, container, elevated areas |
| `--surface-muted` | `#f5f5f4` | Subtle background variant |
| `--border` | `#e7e5e4` | Borders, dividers, strokes |
| `--primary` | `#0c0a09` | Main body text, headings |
| `--secondary` | `#57534e` | Secondary text, labels |
| `--muted` | `#a8a29e` | Placeholder, disabled, subtle text |
| `--accent` | `#0c0a09` | Interactive text, primary buttons (same as primary for minimal look) |
| `--accent-secondary` | `#9333ea` | Links, hover states, decorative accents (plum) |

### Dark Mode (`[data-theme="dark"]`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0c0a09` | Page background |
| `--surface` | `#1c1917` | Card, container, elevated areas |
| `--surface-muted` | `#292524` | Subtle background variant |
| `--border` | `#44403c` | Borders, dividers, strokes |
| `--primary` | `#fafaf9` | Main body text, headings |
| `--secondary` | `#a8a29e` | Secondary text, labels |
| `--muted` | `#78716c` | Placeholder, disabled, subtle text |
| `--accent` | `#fafaf9` | Interactive text, primary buttons |
| `--accent-secondary` | `#d8b4fe` | Links, hover states, decorative accents (plum light) |

### Rule

Never use hex codes in components. Always use Tailwind classes:
- `bg-background`, `bg-surface`, `bg-surface-muted`
- `text-primary`, `text-secondary`, `text-muted`
- `text-accent-secondary` for links/hoverable text
- `border-border`
- `hover:text-accent-secondary` for interactive hover

---

## 2. Typography

| Role | Font | CSS Variable | Tailwind Class |
|------|------|-------------|----------------|
| Headings | Rethink Sans | `--font-heading` | `font-heading` |
| Body | DM Sans | `--font-body` | `font-body` |

### Scale

- **Hero title**: `text-5xl` or `text-6xl` `font-heading` `tracking-tight`
- **Section heading**: `text-3xl` `font-heading`
- **Card title**: `text-xl` `font-heading`
- **Body**: `text-base` `font-body` `leading-relaxed`
- **Small / meta**: `text-sm` `font-body` `text-muted`
- **Caption / label**: `text-xs` `font-body` `text-muted` `uppercase` `tracking-wider`

### Weights

- Headings: use Rethink Sans default weights (variable font, typically 400-700)
- Body: DM Sans default (typically 400 for body, 500 for emphasis)
- No hardcoded font-weight values — rely on font's natural weight scale.

---

## 3. Spacing & Layout

- Use Tailwind's built-in spacing scale (`p-4`, `gap-6`, `py-12`, etc.)
- Section spacing: `py-16` to `py-24` between major sections
- Card padding: `p-6` or `p-8`
- Grid gap: `gap-6` or `gap-8` for project grids
- Max content width: use `Container` component (centered `max-w-6xl` with `px-4` or `px-6`)
- Border radius: `rounded-lg` for cards, `rounded-xl` for large containers, `rounded-full` for avatars/badges
- Shadows: use `shadow-sm` for subtle elevation. No hardcoded shadow values.

---

## 4. Component Patterns

### Buttons
- Primary: `bg-accent text-background font-body px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`
- Secondary/Outline: `border border-border text-primary px-6 py-3 rounded-lg hover:border-accent-secondary hover:text-accent-secondary transition-colors`
- Ghost: `text-secondary hover:text-accent-secondary transition-colors`
- Cursor: add `cursor-pointer` on all interactive elements.

### Cards (Project cards, etc.)
- Container: `bg-surface border border-border rounded-xl overflow-hidden`
- Hover: `hover:border-accent-secondary/30 transition-colors` (subtle border tint)
- Image aspect ratio: `aspect-video` or `aspect-4/3` for thumbnails
- No shadow unless specified.

### Navigation (Header)
- Fixed at top: `fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm`
- Inner: `flex items-center justify-between max-w-6xl mx-auto px-6 py-4`
- Links: `text-secondary hover:text-accent-secondary transition-colors`
- Active link: `text-primary font-medium`

### Hero Section
- Full viewport minus header: `min-h-[calc(100dvh-4rem)]`
- Centered content: `flex flex-col items-center justify-center text-center`
- Headline: `font-heading text-5xl md:text-6xl lg:text-7xl tracking-tight`
- Subheadline: `text-lg md:text-xl text-secondary mt-4 max-w-2xl`
- CTA buttons: group below subheadline with `mt-8` and `gap-4`

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
- Individual tag: `text-xs font-body text-muted bg-surface-muted px-3 py-1 rounded-full`

### Form Inputs (Contact + Admin)
- Input: `w-full bg-surface border border-border rounded-lg px-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:border-accent-secondary transition-colors`
- Label: `text-sm text-secondary mb-1`
- Error: `text-xs text-red-500 mt-1`
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

## 8. Responsive Design

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

## 7. Icons

- Import from `react-icons`:
  - Tech/brand logos: `import { SiReact, SiFigma } from "react-icons/si"`
  - UI icons: `import { LuSun, LuMoon } from "react-icons/lu"`
- Sizing: `size={20}` for inline, `size={24}` for larger UI icons
- Color: inherit parent text color by default, or use `className="text-accent-secondary"`
- All interactive icons need `aria-label` for accessibility.
