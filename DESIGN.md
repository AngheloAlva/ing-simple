# IngSimple — Design System Reference

Reference for building a new section or page that looks native to this site.
Every token, class and component named here exists in the code; paths are
relative to the repo root. Stack: Next.js App Router, Tailwind 4, `motion/react`,
shadcn base, `next-themes` (`.dark` class).

## 1. Principles

- One family, two weights. Geist Sans regular for headlines, Geist Sans semibold
  for the emphasized phrase. The contrast is weight, not typeface.
- One emphasis per headline, placed on the thing the section exists for.
- Blue is the only accent. Green marks an outcome, once. Nothing else is coloured.
- Squared chrome. 4px corners everywhere the UI touches the user; larger radii
  belong to mockups that read as screens or devices.
- Hairlines, not shadows. Sections are framed with `border-border` and corner
  marks; shadows are reserved for window mockups.
- Diagrams show a real thing with real names and a result, never a mute wireframe.
- Motion is an entrance, not decoration: one soft ease, once per element,
  `prefers-reduced-motion` respected in every component.
- Copy is Spanish, concrete and operational. Code and comments are English.

## 2. Color

Defined in `app/globals.css` (`:root` and `.dark`), exposed through `@theme inline`
as Tailwind utilities (`bg-*`, `text-*`, `border-*`).

| Token                   | Light                         | Dark                      | Use                                           |
| ----------------------- | ----------------------------- | ------------------------- | --------------------------------------------- |
| `background`            | `oklch(1 0 0)`                | `oklch(0.145 0 0)`        | page, tiles inside banded sections            |
| `foreground`            | `oklch(0.145 0 0)`            | `oklch(0.985 0 0)`        | headlines, body                               |
| `muted`                 | `oklch(0.97 0 0)`             | `oklch(0.269 0 0)`        | subtle fills (`bg-muted/40` bands)            |
| `muted-foreground`      | `oklch(0.556 0 0)`            | `oklch(0.708 0 0)`        | body copy, kickers, meta                      |
| `card`                  | `oklch(1 0 0)`                | `oklch(0.205 0 0)`        | card surfaces, dark bands (`dark:bg-card/50`) |
| `border`                | `oklch(0.922 0 0)`            | `oklch(1 0 0 / 10%)`      | every hairline                                |
| `primary`               | `oklch(0.3754 0.151 259.74)`  | `oklch(0.55 0.16 259.74)` | accent that adapts to theme                   |
| `ring`                  | same as primary               | `oklch(0.62 0.15 259.74)` | focus rings (`.focus-ring`)                   |
| `brand-blue`            | `oklch(0.3745 0.1497 259.61)` | identical                 | logo and CTA colour, same in both themes      |
| `brand-blue-foreground` | `oklch(0.985 0 0)`            | identical                 | text on `bg-brand-blue`                       |
| `brand-green`           | `oklch(0.6864 0.175 153.45)`  | `oklch(0.72 0.17 153.45)` | FILL only (dots, bars, chips)                 |
| `brand-green-text`      | `oklch(0.52 0.132 153.45)`    | same as fill              | any green text (AA on white)                  |
| `destructive`           | `oklch(0.577 0.245 27.3)`     | `oklch(0.704 0.191 22.2)` | form errors, "before" states only             |

Rules

- CTAs and accents: `brand-blue` (buttons, corner marks, focus) or `primary`
  (diagram strokes, numbering, progress lines). `primary` lifts in dark mode;
  `brand-blue` does not, so use `primary` for anything that must stay readable
  on dark surfaces and `brand-blue` for the button and the marks.
- `brand-blue` is 3.6:1 on white: fine for large text, borders and icons; never
  for small body text (use `foreground`).
- Green appears once per visual as the outcome: a single live dot, a favorable
  bar, one metric (`text-brand-green-text`), one chip
  (`border-brand-green/50 bg-brand-green/15 text-brand-green-text`). Never a
  second accent, never a section colour. Selection colour is green (`selection:bg-brand-green`).
- No red in diagrams or dashboards. `destructive` is for the contact form error
  and the "antes" column of before/after.
- `text-accent` is not a text colour: `--accent` equals the muted surface, so it
  paints text the colour of the background. Use `text-primary`.
- Highlighted phrases use `brandGradient` from `lib/gradient.ts`
  (`["var(--color-blue-400)", "var(--brand-blue)"]`). `brandGradientGreen` exists
  for the outcomes section only and fails AA on light backgrounds by design.
- Ambient backgrounds are radial gradients built from `var(--foreground)` or
  `var(--background)` with `color-mix`, never a second hue (`components/hero.tsx`).

### Service accents

Each of the four service lines gets one distinctive hue, defined once in
`app/globals.css` and mirrored in `lib/service-accent.ts` for consumers that
can't read a CSS custom property (`lib/service-accent-map.test.ts` guards the
two from drifting apart):

| Service            | Light (`--primary` / `--brand-blue`)     | Dark (`--primary` / `--brand-blue`)      |
| ------------------- | ----------------------------------------- | ----------------------------------------- |
| Reportabilidad      | `oklch(0.56 0.135 85)` / `oklch(0.85 0.17 92)` (Power BI amber/yellow) | `oklch(0.85 0.17 92)` / same |
| Capacitaciones      | `oklch(0.3745 0.1497 305)` (violeta)       | `oklch(0.62 0.19 305)`                    |
| Desarrollo web      | `oklch(0.3745 0.1497 350)` (magenta)       | `oklch(0.62 0.21 350)`                    |
| Automatizaciones    | `oklch(0.5 0.085 205)` (turquesa)          | `oklch(0.66 0.11 205)`                    |

Same two-role split as the base tokens: `--primary` is text-safe (headline
gradient end stop, kickers, chip text, focus ring), `--brand-blue` is the
surface/fill token (buttons, panels, decorative fills), always paired with
`--brand-blue-foreground`. Reportabilidad is the only service where the two
roles differ in light mode — the surface goes full Power BI yellow while the
text stays at an amber dark enough for AA contrast. In dark mode, and for
every other service, `--primary` and `--brand-blue` collapse onto the same
value, the same trade-off the base `brand-blue` token already makes (see the
rule above).

**Mechanism:** any element carrying `data-service="<slug>"` scopes
`--brand-tint`, `--primary`, `--primary-foreground`, `--brand-blue`,
`--brand-blue-foreground` and `--ring` to that service's accent for its whole
subtree — the CSS is a plain attribute selector, so it recolours every
descendant that reads those tokens without those components knowing about
services at all.

Applied on: the service page's `<main>` (`app/servicios/[slug]/page.tsx`,
the "as yellow as possible" tree), the home services card's copy column —
number, check marks, CTA hover (`components/services-stack.tsx`, scoped to
the copy column only, not the diagram), the category chip on `/casos` cards
and the `/casos/[id]` hero (`serviceSlugForCategory`), the per-service filter
chips in the guías explorer, the nav dropdown's preview tile
(`components/nav-visual.tsx`), and the per-service OG image
(`app/servicios/[slug]/opengraph-image.tsx`, via `oklchToHex` since
`ImageResponse` can't parse `oklch()`).

Deliberately **not** applied: the nav chrome outside the dropdown preview
tile, the footer, `/contacto`, and `/casos/[id]` beyond its one chip — all
stay brand blue.

## 3. Typography

Fonts (`app/layout.tsx`): `Geist` → `--font-geist-sans`, `Geist_Mono` → `--font-geist-mono`,
both `display: "swap"`. `globals.css` maps `--font-sans`, `--font-mono`, and
aliases `--font-serif` to the sans stack. `font-serif` therefore renders Geist
regular; the class survives as the marker of a headline, not a different face.

### Headline signature

The test of whether a section is current. Regular headline with one semibold
span on the emphasized words:

```tsx
<h2 className="mt-4 font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
  Cuatro etapas, <span className="font-sans font-semibold tracking-tight">ninguna caja negra</span>
</h2>
```

Span is always exactly `font-sans font-semibold tracking-tight` (30 occurrences).
When the emphasis carries the page promise it is a `GradientText` with the same
classes plus `colors={brandGradient} animationSpeed={6} inline`.

| Level           | Classes                                                                                                                                         | Where                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Page hero h1    | `font-serif text-4xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]`                                    | service hero, /casos, /sobre-nosotros, /contacto (`sm:text-5xl` only) |
| Section h2      | `font-serif text-3xl leading-[1.1] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]` (`leading-[1.12]` in older files) | every section                                                         |
| Final CTA h2    | `font-serif text-4xl leading-[1.08] ... sm:text-5xl lg:text-[3.75rem]`, centered                                                                | `components/final-cta.tsx`                                            |
| Sub-block h3    | `font-serif text-2xl font-normal tracking-tight sm:text-3xl`                                                                                    | contact card, story blocks                                            |
| Card/step title | `text-lg font-semibold tracking-tight sm:text-xl` or `text-sm font-semibold tracking-tight`                                                     | steps, tiles                                                          |
| Big figure      | `font-serif text-3xl font-normal tracking-tight tabular-nums sm:text-4xl` (up to `text-6xl` for stats)                                          | metrics                                                               |
| Kicker          | `Kicker` from `components/corner-plus.tsx` → `text-muted-foreground text-sm font-medium`                                                        | above every h1/h2                                                     |
| Body            | `text-muted-foreground text-sm leading-relaxed sm:text-base`, hero lede `text-[15px] ... sm:text-base`                                          | paragraphs, capped with `max-w-md`/`max-w-xl`                         |
| Mono label      | `font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground` (`text-[10px] tracking-[0.16em]` when smaller)                        | axis labels, meta inside diagrams, footer links                       |
| Mono figure     | `font-mono text-xs font-medium tabular-nums text-primary`                                                                                       | numbering, counters                                                   |

Spacing under a kicker: `mt-4` (h2) or `mt-5` (h1). Body under a headline: `mt-4`
(sections) or `mt-5` (heroes). Buttons row: `mt-8 flex flex-wrap gap-3`.
Headlines always carry `text-balance`.

## 4. Layout and spacing

### Container

`mx-auto max-w-360 px-5 sm:px-8 lg:px-10` — `max-w-360` is 1440px. Older files
spell it `max-w-[1440px]`; both are the same width. Nav uses the same container
with `h-16`.

### Section rhythm

| Context                  | Wrapper classes                                                          | Files                                                                    |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Home section             | `mx-auto max-w-360 px-5 pb-32 sm:px-8 sm:pb-44 lg:px-10`                 | challenge, case-study-feature, services-stack, trusted-by (`pb-32` only) |
| Home banded section      | `<section class="... mb-32 sm:mb-44 border-y">` + inner `py-24 sm:py-32` | how-it-works                                                             |
| Subpage section          | `mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10` (19 uses)  | servicios/_, casos/_, case-study/detail-*                                |
| Subpage banded           | `mb-24 sm:mb-32 border-y` + inner `py-24 sm:py-32`                       | servicios/includes                                                       |
| Page top (centered hero) | `pt-32 pb-12 sm:pt-40` (home), `pt-32 pb-16 sm:pt-40` (/casos)           | hero, casos/hero                                                         |
| Page top (split hero)    | `pt-28 pb-16 sm:pt-36 lg:pb-24`                                          | servicios/hero                                                           |
| Standalone page block    | `py-20 sm:py-24`                                                         | contacto, nosotros/story                                                 |
| Final CTA                | inner `py-28 sm:py-36 lg:py-44`, `max-w-2xl` centered                    | final-cta                                                                |

Sections do not stack margin and padding: home sections own bottom padding,
banded sections own bottom margin. The page starts under a fixed `Nav` (h-16),
so heroes carry the top padding.

### Grids

- Split hero / feature: `grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`
  (text left 0.9, artefact right 1.1). Text column is `flex flex-col items-start`.
- Four-step timeline: `grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-x-8`.
- Bento with voice tile: `grid gap-4 sm:gap-5 lg:grid-cols-3`, first tile `lg:col-span-2` and borderless.
- Process: `lg:grid-cols-[minmax(0,0.6fr)_minmax(0,0.4fr)] lg:gap-12`.
- Header block above a grid: `max-w-2xl`, then `mt-8`–`mt-12` before the grid.
  Centered variant: `mx-auto mb-12 max-w-2xl text-center sm:mb-16`.

### Banded sections

Full-bleed band: `border-border bg-muted/40 dark:bg-card/50 relative isolate overflow-hidden border-y`.
Only two places use it: `components/how-it-works.tsx` (home) and
`components/servicios/includes.tsx` ("Qué incluye", `id="incluye"`, `scroll-mt-24`).
Tiles inside a band sit on `bg-background` so they lift off the band.

## 5. Surfaces and shape

### Radius scale (`globals.css` `@theme`)

| Utility                         | Value             | Use                                                             |
| ------------------------------- | ----------------- | --------------------------------------------------------------- |
| `rounded-sm`, `rounded-md`      | 4px               | all chrome: buttons, cards, inputs, badges, chips, step numbers |
| `rounded-lg`                    | 10px (`--radius`) | inner panels of diagrams                                        |
| `rounded-xl` / `rounded-2xl`    | 14px / 18px       | window mockups (`WindowFrame`, case-study visuals)              |
| `rounded-full`                  | –                 | dots, avatars, legend swatches                                  |
| `rounded-[2px]`/`[3px]`/`[1px]` | –                 | micro-elements inside mockups; `ChallengeCard` uses 2px         |

Rule: if a person can click it or it frames copy, it is `rounded-sm`. If it
pretends to be a screen, it may be `rounded-2xl` with `shadow-2xl shadow-black/[0.08]`.

### Borders and cards

- Card: `border-border bg-background relative rounded-sm border` (or `bg-card` for
  the contact form). Padding `p-5` (tiles), `p-6 sm:p-8 lg:p-10` (forms).
- Dividers: `border-t border-border`; dotted `border-dotted` for stat rows and
  story sub-heads; `border-dashed` for pending / open-ended states.
- Hover on tiles: `hover:border-foreground/25`, focus `focus-visible:ring-2 focus-visible:ring-brand-blue/50`.
- Inputs: `w-full rounded-sm border border-border bg-background px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-ring/40`.
- Dotted canvas behind a diagram: `radial-gradient(currentColor 1px, transparent 1px)` at `22px 22px`, `text-foreground/[0.09]`.
- No card shadows. `shadow-*` only on window mockups.

### Corner marks

`CornerPlus` (`components/corner-plus.tsx`): a 14px `+` in `text-brand-blue`,
absolutely positioned on a `relative` bordered box, centred on each corner:

```tsx
<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
```

Used on the logo strip, the contact card and framed visuals (16 files). Always
all four, always on a `border-border` box. Add `hidden lg:block` on a pair when
they would collide on mobile. There is no diagonal cut anywhere; the marks are
the corner treatment.

## 6. Signature components

| Component                | Path                                                    | Use when                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Kicker`                 | `components/corner-plus.tsx`                            | Above every h1/h2: the section name ("Cómo trabajamos", "Qué incluye"). Plain sans, not mono.                                                                                                                                                                                                                                          |
| `CornerPlus`             | `components/corner-plus.tsx`                            | Framing a bordered box that should read as a plate: logo strip, forms, mockup frames.                                                                                                                                                                                                                                                  |
| `CutButton`              | `components/cut-button.tsx`                             | Every button and CTA link. `variant="solid" \| "outline"`, `icon="arrow"` (navigates) or `"send"` (opens a conversation), none for submits. Solid and outline swap on hover; corner brackets snap outward. Height `h-10`, `rounded-sm`, `text-sm font-medium tracking-wide`. Primary + secondary side by side: `solid` then `outline`. |
| `GradientText`           | `components/gradient-text.tsx` (+ `lib/gradient.ts`)    | The one promise phrase in a hero or section headline. Always `inline`, `colors={brandGradient}`, `animationSpeed={6}`, class `font-sans font-semibold tracking-tight`. Parks mid-sweep under reduced motion.                                                                                                                           |
| `CircuitTrace`           | `components/circuit-trace.tsx`                          | Ambient "tech" detail: traces in `var(--primary)` at 0.18 opacity, top-right of a banded section, `opacity-70`, width `w-[min(38rem,62%)]`. Currently only in how-it-works. Not on cards, not repeated per section.                                                                                                                    |
| `WindowFrame`            | `components/window-frame.tsx`                           | macOS chrome for rotating panels; fixed `h-[560px]` body.                                                                                                                                                                                                                                                                              |
| `LogoLoop` + `TrustedBy` | `components/logo-loop.tsx`, `components/trusted-by.tsx` | Client logos: `brightness-0 dark:invert` silhouette by default; `grayscale contrast-125 mix-blend-multiply dark:invert dark:mix-blend-screen` only for logos flagged `blend`. Logos at `opacity-55`, full on hover.                                                                                                                    |
| `ChallengeCard`          | `components/challenge-card.tsx`                         | Bento tile with a diagram area (`h-52 sm:h-56`) and copy; owns hover/focus and publishes it via `DiagramActiveProvider`.                                                                                                                                                                                                               |

Step numbers: `flex h-10 w-10 items-center justify-center rounded-sm font-mono text-sm font-medium bg-primary text-primary-foreground`,
outlined (`border-primary bg-background text-primary border`) for an open-ended stage.
Numbering is zero-padded: `String(i + 1).padStart(2, "0")`.

## 7. Motion

Helpers live in `lib/motion.tsx`; import `useReducedMotion` from there (37 files),
not from `motion/react`.

| Convention     | Value                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ease           | `softEase = [0.22, 1, 0.36, 1]` (ease-out-quint). Files that cannot import a client module redeclare it as `const EASE = [0.22, 1, 0.36, 1] as const`.                                                                             |
| Entrance       | `fadeInUp` (`y: 20` → 0), `duration: 0.6`–`0.7`. Heroes `0.7`, sections `0.6`, artefacts `0.8` with `delay: 0.35`.                                                                                                                 |
| Trigger        | `whileInView="visible"` with `viewport={{ once: true, margin: "-80px" }}`. Tall sections use a percentage bottom margin (`"0px 0px -30% 0px"`); `inViewViewport` in `lib/motion.tsx` uses `-32%`.                                  |
| Stagger        | `staggerChildren: 0.08`–`0.12` (`0.1` for step lists, `0.12` for hero items with `delayChildren: 0.35`).                                                                                                                           |
| Page wrapper   | `<InView>` from `lib/motion.tsx` around each below-the-fold section in `app/*/page.tsx`; heroes use `animate="visible"` on mount.                                                                                                  |
| Recipe hook    | `useStaggerEntrance()` returns `container`, `item`, `itemTransition`, `viewport`; put `container` on the wrapper, `item` + `itemTransition` on each child. `StaggerInView` is the ready-made wrapper.                              |
| Hover          | Colours only, `transition-colors duration-300 ease-out`; press `active:scale-[0.96]`.                                                                                                                                              |
| Reduced motion | Every animated component branches on `useReducedMotion()`: variants become `reducedMotionVariants` (opacity only), transitions `{ duration: 0.01 }`, loops render their final frame. `globals.css` also clamps all CSS animations. |

Do not measure scroll-driven animations with `window.scrollTo` (Lenis smooth
scroll intercepts it), and expect Motion loops to freeze in headless screenshots.

Scroll pins and `useTransform`: the keyframe-array form
(`useTransform(progress, [0, 1], ["0%", "100%"])`) did not hold its end value in
the pinned scroll gallery that has since been removed from this codebase. Once the
pin completed, the whole panel snapped to invisible in a single scroll step,
because the value is recomputed every frame. The callback form
(`useTransform(progress, (v) => …)`) held it. Live code still uses the keyframe form
in `components/case-study/detail-timeline.tsx` and
`components/diagrams/process/rollout-gantt.tsx`; if either jumps or vanishes at the
end of its travel, start here.

## 8. Diagrams and visuals

Shared primitives in `components/diagrams/`:

- `Reveal` / `RevealGroup` (`reveal.tsx`): staggered entrance for every diagram
  part. `RevealGroup` fires once at `-12%` with `stagger 0.085`, `delay 0.26`;
  `Reveal pop` for a beat that lands (a verdict, a cut).
- `useStepLoop({ active, steps, duration, pauseMs })` (`use-step-loop.ts`): walks
  a sequence, holds the finished picture (`index === steps`), replays.
  Typical `STEP_MS = 900`, `PAUSE_MS = 4000`.
- `DiagramActiveProvider` / `useDiagramActive` (`hover-context.tsx`): the frame
  decides what activates a diagram (hover + focus in bento tiles, `useInView`
  at `amount: 0.6` in the timeline). Diagrams read the flag and never observe
  the viewport themselves.
- `interactive-diagram.tsx`: `useBuild` / `useAutoBuild` for "build it on hover"
  service artefacts that assemble on first view (`threshold: 0.35`).

Rules

- A diagram has real names and a result: "Planillas · 12 archivos", "4 h",
  a total that the copy is about. No lorem, no grey boxes standing in for content.
- Diagram dialect: tiny type (`text-[10px]`–`text-[11px]`), hairline tiles
  (`border-border/60 bg-background rounded-sm`), `tabular-nums`, primary
  opacity tiers (`bg-primary/10`, `border-primary/30`), one green accent at most.
- Service artefacts are keyed by href in `components/service-diagrams.tsx`
  (`SERVICE_VISUALS`) and shown both in the home stack and the service hero.
- Case mockups come from `components/case-study/visuals/registry.ts` and must be
  read from a client module (`components/servicios/case-thumbnail.tsx`); a server
  component gets an opaque reference and renders nothing.
- Carousels and previews mount only the active mockup (`AnimatePresence` +
  `key`), never all six.
- Never overlay UI on a mockup: they carry their own browser chrome. Captions go
  below in a bordered footer (`border-t px-5 py-4`), thumbnails strip radius with
  `[&>*]:!rounded-none`.
- Diagram frames are `aria-hidden`; they illustrate the copy next to them.

## 9. Page patterns

Every page: `<span id="top" className="sr-only" />`, `<Nav />`,
`<main id="main-content" className="flex-1">`, sections, `<FinalCta />`, `<Footer />`
wrapped in `<InView>`.

| Page                                      | Order                                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home (`app/page.tsx`)                     | HeroWaves + Hero → HeroShowcase (MotionSection, delay 0.55) → TrustedBy → Challenge → ServicesStack → HowItWorks (banded) → CaseStudy → Faq → FinalCta                               |
| Service (`app/servicios/[slug]/page.tsx`) | ServicioHero → ServicioProblem → optional Module → ServicioIncludes (banded, `#incluye`) → ServicioProcess → ServicioCases → ServicioFaq → FinalCta(service copy)                    |
| Case (`app/casos/[id]/page.tsx`)          | DetailHero → Context → Solution → Architecture → TechStack → Features → Timeline → Metrics → BeforeAfter → Related → FinalCta; `accent = project.gradientColor ?? var(--brand-blue)` |
| Nosotros (`app/sobre-nosotros/page.tsx`)  | Story (split, stats on dotted rule) → MissionVision → Values → Stack → FinalCta                                                                                                      |
| Contacto                                  | `ContactoSection`: h1 + lede left, `CornerPlus` card with the form right                                                                                                             |

Service hero: no breadcrumb, no number. `Kicker` = short service name, h1 =
`pageTitle` + `GradientText` `pageTitleAccent`, lede, `solid send "Conversemos"` +
`outline "Qué incluye"` (`#incluye`), artefact in the 1.1 column.

Home hero is the one exception to the serif/semibold pair: `font-sans` h1 with
`GradientText className="font-medium"` on "Soluciones Simples".

## 10. Copy and voice

- Neutral Spanish, tuteo ("tu operación", "sabes qué se está haciendo"), never voseo.
- Concrete and operational: name the artefact, the number, the stage. No
  superlatives, no "revolucionar".
- Headlines state a stance ("Cuatro etapas, ninguna caja negra"; "Casos medidos
  en resultados, no en pantallas"). The emphasized span is the claim.
- Kickers are section names, two or three words, sentence case.
- Buttons are verbs or verb phrases: "Explorar servicios", "Conversemos",
  "Agenda tu consulta gratis".
- Copy lives in data (`lib/services.ts`, `lib/portfolio-data.ts`) with typed
  fields (`pageTitle` / `pageTitleAccent`, `includes[]`, `process[]`, `faq[]`);
  sections render, they do not author.
- UI copy Spanish; code, comments, file names, commit messages English.

## 11. Do / Don't

Do

- Start every section with `Kicker` → signature h2 → `text-muted-foreground` lede → content.
- Use the container string verbatim and one of the rhythm rows in section 4.
- Use `CutButton` for every action; `solid` + `outline` as a pair.
- Keep chrome at `rounded-sm`; use `rounded-2xl` only on a mockup with its own chrome.
- Frame plates with `border-border` and four `CornerPlus`.
- Reuse `brandGradient`, `softEase`, `-80px` viewport, `useReducedMotion` from `lib/motion`.
- Give diagrams a `DiagramActiveProvider` frame and `Reveal` entrances.

Don't

- Don't put more than one semibold span in a headline, or none where a claim exists.
- Don't use green as a second accent, red anywhere in a diagram, or `text-accent` as a text colour.
- Don't add a banded background to a new section; two bands is the budget.
- Don't add `CircuitTrace` to cards or to every section.
- Don't stack shadows on cards, or add a diagonal cut to corners.
- Don't mount every mockup in a carousel, or place badges over a mockup.
- Don't import `useReducedMotion` from `motion/react` in new files.
- Don't hardcode service slugs; read `href`/`slug` from `lib/services.ts`.

## 12. Known gaps

- Icons are still template art (lucide + animated icons); deferred to the SEO pass.
- Two spellings of the container (`max-w-360` vs `max-w-[1440px]`) and two
  vertical rhythms (home `pb-32 sm:pb-44`, subpages `pb-24 sm:pb-32`) coexist.
- `font-serif` is an alias of the sans stack; the "serif" in the signature is
  historical naming, not a second family.
- `brandGradientGreen` fails WCAG on light surfaces (documented trade-off in `lib/gradient.ts`).
- Case-study visuals (`components/case-study/visuals/*`) still use red in
  traffic-light dots, alert states and one warning gradient (`otc.tsx`).
- Guide article (`/guias/[slug]`): a centred `max-w-prose` column with a
  `16rem` sticky TOC rail at `lg` (`app/guias/[slug]/page.tsx`); pull quotes
  are typographic (`components/guias/mdx-components.tsx`), not cards; guides
  get their own explanatory diagrams under `components/guias/diagramas/`,
  never a reused service hero visual. Demos are still undecided.
