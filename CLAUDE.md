# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run lint         # ESLint check
pnpm run lint:fix     # ESLint auto-fix
pnpm run format       # Prettier format all files
pnpm run format:check # Prettier check formatting
pnpm run typecheck    # TypeScript type checking (tsc --noEmit)
```

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5** (strict mode)
- **Tailwind CSS v4** — configured inline via `@theme` in `src/app/globals.css`, no tailwind.config file
- **motion/react** — animations with reduced-motion support via `ReducedMotionProvider`
- **Lenis** — smooth scrolling
- **next-themes** — dark mode with system detection
- **Three.js / React Three Fiber** — WebGL dither cursor effect

## Architecture

### Routing & Layouts

- Route group `(pages)` wraps all public pages
- Root layout (`src/app/layout.tsx`): Providers, SkipToContent, ThemeSwitch
- Pages layout (`src/app/(pages)/layout.tsx`): Header, Footer wrapper

### Section-Based Pages

Each page is composed of domain-specific section components. Sections live under `src/components/sections/{domain}/`:

- `home/` — hero, rotating-cards, how-it-works, services, showcase, stats, testimonials, about, faq
- `reportability/` — hero, features, how-it-works, showcase, stats, cta, faq
- `web/` — hero, features, how-it-works, comparison, tech-stack, stats, cta, faq

Service pages follow the same section pattern. New service pages should replicate this structure.

### Key Files

- `src/lib/config.ts` — All site content, nav links, feature flags, and section configurations. Edit this for text/content changes.
- `src/lib/metadata.ts` — SEO metadata utilities with `createMetadata()` helper for per-page metadata
- `src/lib/motion.tsx` — Shared animation variants (`fadeIn`, `fadeInUp`, `scaleIn`, `staggerContainer`) and motion wrapper components (`MotionDiv`, `MotionSection`, `StaggerContainer`, `StaggerItem`)
- `src/components/shared/providers.tsx` — Provider stack: ThemeProvider → ReducedMotionProvider → SmoothScroll

### Design Tokens

CSS custom properties defined in `src/app/globals.css` with light/dark variants. Key tokens: `--background`, `--foreground`, `--accent` (oklch teal), `--ring` (oklch purple), `--muted`, `--border`.

## Conventions

- **Import aliases**: `@/*` → `src/*`, `@/components/*`, `@/lib/*`
- **File naming**: kebab-case for files, PascalCase for component exports
- **Client components**: Use `"use client"` only for interactive/animated components
- **Formatting**: Tabs, no semicolons, double quotes (see `.prettierrc`)
- **ESLint**: Unused vars allowed with `_` prefix, no explicit `any`
- **Service pages**: Each service has its own color theme applied via section props
