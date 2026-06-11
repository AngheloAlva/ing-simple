# Security — Sentinel

A premium, dark-first **security platform landing page** built with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. It pairs a restrained editorial type system (serif display + mono accents) with signature interactive set pieces — a WebGL scroll-reveal "curtain" image, ASCII-art icons and portraits, a pinned duotone coverage gallery, count-up stats, and a chamfered "cut" UI language — all fully theme-aware, accessible, and reduced-motion friendly.

## Features

- ✅ **Next.js 16+** with App Router (fully static-prerendered)
- ✅ **React 19** + **TypeScript** (strict mode, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- ✅ **Tailwind CSS v4** with CSS-variable design tokens
- ✅ **Dark Mode** via next-themes (floating bottom-right switch), dark-first design
- ✅ **Smooth Scroll** via Lenis (feature-flagged, auto-disabled for reduced motion)
- ✅ **Motion** via motion/react with full reduced-motion fallbacks
- ✅ **WebGL** via React Three Fiber + three (on-demand, offscreen-paused render loops)
- ✅ **SEO Ready** — metadata, Open Graph, Twitter cards, dynamic `robots` + `sitemap`
- ✅ **Accessibility** — skip link, focus rings, ARIA labels, proper heading order
- ✅ **Edge Compatible** — no Node-only APIs in runtime code

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |

## Page Sections

The landing page (`app/page.tsx`) is composed top to bottom from:

| Section | Component | Highlights |
|---------|-----------|------------|
| **Nav** | `nav.tsx`, `nav-visual.tsx`, `logo.tsx` | Sticky nav, animated dropdown mega-menu, mobile sheet |
| **Hero** | `hero.tsx`, `hero-waves.tsx` | Serif headline, staggered entrance, animated ASCII wave backdrop |
| **Product mockup** | `window-mockup.tsx` | Chamfered app-window frame with looping demo video |
| **Trusted by** | `trusted-by.tsx` | Theme-aware brand wordmarks framed by corner-plus crosshairs |
| **Coverage grid** | `coverage-grid.tsx`, `duotone.tsx` | Pinned scroll gallery of blue-duotone tiles |
| **Features** | `features.tsx`, `ascii-icon.tsx` | Chamfered cards with live ASCII security glyphs |
| **Value prop** | `value-prop.tsx`, `curtain-image.tsx` | WebGL scroll-reveal "curtain" image with duotone treatment |
| **Testimonials** | `testimonials.tsx`, `ascii-portrait.tsx` | ASCII-rendered portraits, animated quote carousel |
| **Stats** | `stats.tsx` | Scroll-triggered count-up numbers, corner-plus panel, brand attributions |
| **Case study** | `case-study.tsx` | Inline brand wordmark in a serif statement + CTA |
| **Pricing** | `pricing.tsx` | Monthly/yearly toggle with sliding indicator + rolling price digits |
| **FAQ** | `faq.tsx` | Accordion framed by the corner-plus motif |
| **Final CTA** | `final-cta.tsx` | Closing call-to-action |
| **Footer** | `footer.tsx` | Link columns, social icons, chamfered panel |

## Signature Components

Reusable building blocks that define the template's look and feel:

- **`cut-button.tsx`** — the chamfered "cut-corner" button (solid / outline / icon-only / full-width) used for every CTA.
- **`corner-plus.tsx`** — the blue crosshair `CornerPlus` mark + `Kicker` label that frame panels across the site.
- **`ascii-icon.tsx`** — canvas ASCII-art icons (`scan`, `shield`, `key`, `bolt`, `plus`, `bars`) rasterized into a coarse glyph mask with a scan-band + twinkle animation; freezes to a static frame under reduced motion.
- **`ascii-portrait.tsx`** / **`ascii-waves.tsx`** — ASCII rendering for testimonial portraits and the hero's animated wave field.
- **`curtain-image.tsx`** — self-contained R3F shader that unveils an image with a wavy "curtain" sweep + accent fringe; renders on demand and pauses offscreen.
- **`duotone.tsx`** — shared blue-duotone recipe (container field + base filter + mix-blend overlays) applied to both the coverage grid and the value-prop image, theme-aware in light and dark.
- **`window-mockup.tsx`** — chamfered product-window frame.

## Project Structure

```
├── app/
│   ├── globals.css        # Design tokens, dark variant, base styles
│   ├── layout.tsx         # Root layout, fonts, providers, theme switch
│   ├── page.tsx           # Landing page composition
│   ├── robots.ts          # Dynamic robots.txt
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── icon.svg           # Favicon
│   └── apple-icon.svg     # Apple touch icon
├── components/
│   ├── nav.tsx, nav-visual.tsx, logo.tsx          # Navigation
│   ├── hero.tsx, hero-waves.tsx, ascii-waves.tsx  # Hero + ASCII backdrop
│   ├── window-mockup.tsx                          # Product mockup
│   ├── trusted-by.tsx                             # Logo wall
│   ├── coverage-grid.tsx, duotone.tsx             # Pinned duotone gallery
│   ├── features.tsx, ascii-icon.tsx              # Feature cards + ASCII glyphs
│   ├── value-prop.tsx, curtain-image.tsx         # WebGL curtain reveal
│   ├── testimonials.tsx, ascii-portrait.tsx      # Quote carousel
│   ├── stats.tsx, case-study.tsx                 # Social proof
│   ├── pricing.tsx, faq.tsx, final-cta.tsx       # Conversion
│   ├── footer.tsx                                # Footer
│   ├── cut-button.tsx, corner-plus.tsx           # Shared UI primitives
│   └── providers.tsx, theme-switch.tsx,          # App shell
│       smooth-scroll.tsx, skip-to-content.tsx
├── lib/
│   ├── config.ts          # Feature flags (smooth scroll)
│   ├── metadata.ts        # SEO metadata utilities
│   ├── motion.tsx         # Motion components, hooks & reduced-motion provider
│   └── utils.ts           # Helpers
└── public/
    ├── grid/              # Coverage-grid tiles
    ├── logos/             # Brand wordmarks (CSS-mask recolored)
    ├── testimonials/      # Portrait sources
    ├── value-prop.jpg     # Curtain-image source
    └── site.webmanifest   # PWA manifest
```

## Customization

### 1. Update Site Configuration

Edit `lib/metadata.ts` to update:
- Site name, description, and URL
- Social media handle (`creator`)
- Keywords and authors

### 2. Toggle Features

Edit `lib/config.ts`:

```ts
export const features = {
  smoothScroll: true, // Lenis; falls back to native smooth scroll when false
} as const;
```

### 3. Customize Design Tokens

Edit `app/globals.css` to modify the color palette and dark-mode overrides. The brand accent (`#2f80ff`) is applied directly in components (corner pluses, ticks, highlights) — search for it to retheme the accent.

### 4. Swap Content & Assets

- Section copy lives as typed arrays at the top of each component (`TIERS`, `STATS`, `TESTIMONIALS`, `FEATURES`, …).
- Replace imagery in `public/grid`, `public/testimonials`, `public/logos`, and `public/value-prop.jpg`.
- Replace `app/icon.svg`, `app/apple-icon.svg`, and `public/og-image.png` with your brand assets.

### 5. Add Routes

```tsx
// app/about/page.tsx
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "About Us",
  description: "Learn more about our company.",
  path: "/about",
});

export default function AboutPage() {
  return <main id="main-content">...</main>;
}
```

## Design Tokens

The template uses CSS custom properties for theming, driven off a `.dark` class (`app/globals.css`):

### Colors
- `--background` / `--foreground` — Page background and text
- `--muted` / `--muted-foreground` — Subtle backgrounds and secondary text
- `--accent` / `--accent-foreground` — Neutral action colors
- `--border` / `--ring` — Borders and focus rings
- **Brand accent** — `#2f80ff`, applied in-component (plus marks, ticks, highlights)

### Typography
- `--font-sans` — Geist Sans (UI)
- `--font-serif` — Source Serif 4 (display headlines)
- `--font-mono` — Geist Mono (labels, ASCII glyphs)

## Accessibility

The template includes:
- Skip-to-content link
- Visible focus rings (keyboard navigation)
- ARIA labels on interactive and decorative elements
- Reduced-motion support across every animation (ASCII, WebGL, count-up, Lenis)
- Proper heading hierarchy
- WCAG 2.1 AA contrast targets

## Edge Runtime

All code is Edge-compatible. No Node.js-only APIs are used in runtime code. The template can be deployed to:
- Vercel Edge Functions
- Cloudflare Workers
- Any edge-capable platform

## License

Commercial license. This template is licensed, for use in unlimited
personal and commercial projects by the purchaser. You may not resell,
redistribute, or sublicense the template itself. See [LICENSE](./LICENSE) for
the full terms.
