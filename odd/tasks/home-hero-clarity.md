# Home hero: commercial clarity without losing visual impact

## Goal

Make the home hero communicate what Ingeniería Simple sells, to whom, and in how
many service lines — without giving up the full-bleed ASCII background and the
centred composition that currently define the page's visual impact.

The hero is the first thing every visitor sees and the strongest SEO asset on the
page. Today it shows a slogan, two buttons, and a mockup whose only navigation
(pure the four service tabs) sits 349 px below the fold at 1366×768.

## Source of truth for this work

The audit that produced this plan was measured in a browser, not inferred from
code. It is recorded in `odd/tasks/home-hero-clarity-audit.md` and summarised in
the Engram observation `topic_key: odd/home-hero-clarity/tasks`.

## Decisions taken by the user

- **Composition:** the four service tabs become the frame's top chrome (a tab
  strip on the window), not a row of progress bars below the frame.
- **Scope of this iteration (Fase 1):** clarity and visual bugs only. No panel
  redesign, and the desktop frame height stays at 560 px.
- **Background:** the ASCII/video background stays as it is. Only a small opacity
  increase is allowed. No change to the video source, the shader, or the aspect
  handling.
- **Balance sought:** commercial clarity and visual impact together, not one at
  the cost of the other.

## Non-goals for Fase 1

- Redesigning the four panel mockups.
- Changing the 560 px desktop frame height.
- Touching `components/ascii-waves.tsx`, `components/hero-waves.tsx`, the video
  asset, or the wave shaders.
- Redesigning the panel internals beyond what is required to stop losing content.

## Tasks

### T1 — Service navigation becomes the frame chrome

Status: **done** — commit `d5300b0`.

Owner: `gentle-ai-worker`. Edit surfaces: `components/window-frame.tsx`,
`components/hero-showcase.tsx`, `components/hero-showcase.test.tsx` (new).

Two defects were found during parent verification of the writer's output and
fixed before the commit — see "Deviations and findings from T1" below.

- The four tabs move into the window chrome and replace the separate indicator row
  that today sits below the frame.
- Tab labels come from `SERVICES[].shortName` in `lib/services.ts`, in the order of
  that array. The hardcoded `ITEMS[].service` and `ITEMS[].label` fields go away.
  A module-level map from `slug` to panel component stays, because the panels are
  not part of `lib/services.ts`.
- `WindowFrame` loses its `label` prop (the thing that produced the duplicated
  title) and gains a `tabs` slot rendered inside the chrome row. `WindowFrame`
  stays presentational.
- The active tab carries the cycle progress in its own underline, so the four
  bars can no longer read as one continuous line.
- A visible, keyboard-reachable pause/resume control is added (WCAG 2.2.2). It is
  not rendered under `prefers-reduced-motion`, because nothing advances then.
  Hover-to-pause stays as a convenience.
- ARIA: drop `aria-controls` from the tabs (it currently points at panel ids that
  are not mounted, which is a broken reference), keep `aria-selected`, roving
  `tabIndex`, `aria-labelledby` on the tabpanel, and add `tabIndex={0}` to the
  tabpanel so its content is reachable.
- Frame body height becomes responsive so the chrome growth does not eat panel
  room: 560 px from `lg` up, taller below `lg`. The exact mobile value is
  calibrated in T4 against the zero-clipping acceptance criterion.

Acceptance criteria and result:

1. `renderToStaticMarkup` of `HeroShowcase` contains the four `shortName` values in
   `SERVICES` order, and contains no string that duplicates a panel heading.
   → met, covered by `components/hero-showcase.test.tsx`.
2. A test fails if a service is added to `SERVICES` without a panel, or if a panel
   exists without a service. → met via `PANEL_BY_SLUG` and a drift-guard test.
3. At 1366×768 the four tab labels are inside the first 768 px of the page.
   → met: measured at y=504-544.
4. Under `prefers-reduced-motion` no auto-advance and no pause control.
   → met for the control; the absence of auto-advance is covered by the existing
   `prefersReducedMotion` early return in the rAF effect.

### Deviations and findings from T1

- **The default panel changed.** Deriving the list from `SERVICES` order moved
  Reportabilidad to first, where the hardcoded list started with Automatizaciones.
  This was accepted deliberately: the automation flow left roughly 230 px of empty
  canvas above the fold, while the reportability panel fills it with four KPI cards.
  It also aligns the hero with the services stack, the footer and the guías filter,
  which all read `SERVICES` order.
- **A regression the writer introduced and could not see.** Its `scrollIntoView`
  call ran on every auto-advance, and the carousel keeps advancing while the reader
  is far below the hero: a page scrolled to 3000 px was dragged back to 504 px every
  6 seconds. Replaced with arithmetic on the tab strip's own `scrollLeft`, which can
  never move the document. Verified: scrollY stays at 3000 across two cycles.
- **Mobile discoverability was not in the writer's spec.** Four labels need 461 px
  while the strip has 236 px at 390 px wide, so only two services were identifiable
  and nothing signalled the rest. Added mask-based edge fades (the pattern already
  used in `components/final-cta.tsx`), driven by a `ResizeObserver` plus a scroll
  listener so only the sides that actually hide content are faded.
- The frame body height was left at `h-[560px]` for every viewport, as instructed.
  T2 owns it.
- `pnpm lint` fails with 24 errors and 11 warnings, all in files untouched by T1.
  Confirmed pre-existing by running the same command with T1 stashed: identical
  count. `pnpm lint` on the three T1 files is clean.

### T2 — Stop losing panel content

Owner: parent (needs the measurement loop, so it is not delegated).
Edit surfaces: `components/window-frame.tsx` (body height only),
`components/panels/*.tsx`.

- Fix the containers that clip or collapse, with the smallest change that stops the
  loss: the ERP sidebar nav (629 px of content in a 395 px box), the ERP table area
  (collapsed to 1 px on mobile), the training course column (318 px in 217 px), and
  the reportability grid (677 px in 560 px).
- Replace the three nested `<main>` elements with `<div>`. `data/page.tsx` already
  provides the page landmark.
- Mark the demonstration data region `aria-hidden`, so 645 characters of fabricated
  records ("1 - 10 de 2.945", "Filas por página: 10", "recién", dates, an email
  address) stop being announced as real content.

Acceptance criteria: at 390, 768, 1024 and 1440 px wide, every panel reports zero
clipped containers, zero collapsed containers, zero text-on-text overlaps, and the
page reports exactly one `<main>`.

Additional horizontal check required: the audit only measured vertical overflow.
Parent verification of T1 found that at 390 px the KPI values inside Reportabilidad
are cut mid-word ("40,5% del añ", "92,2% del p"). The T2 detector must therefore
compare `scrollWidth` against `clientWidth` as well as `scrollHeight` against
`clientHeight`.

### T3 — Hero copy

Owner: parent, after explicit user approval of the exact wording.
Edit surfaces: `components/hero.tsx`.

- The h1 gains a subject and an outcome, and carries the page's real search terms.
  Today it carries none of them while the metadata does.
- The subtitle loses two of its five ideas.
- The CTA pair stays as it is; the redundancy with the navbar's "Conversemos" is
  recorded but not changed in this iteration.

This task is blocked until the user picks the wording. No h1 is written before that.

### T4 — Measured verification and close

Owner: parent. No source edits.

- Re-run the audit harness: overlap detector, clipping detector, contrast sampling,
  above-the-fold measurement, LCP.
- Report every failed or pending check honestly.
- The background opacity tweak from the user's decision is applied and measured
  here, not earlier, so the contrast numbers are taken on the final composition.

## Known issues left for a later phase

- On mobile the automation panel's fixed 1040 px stage is still cropped
  horizontally. Fixing it properly means giving each panel a narrow-screen form,
  which is panel redesign and therefore out of scope here.
- The four-lens set of internal text sizes (9–12 px) and the five different
  internal radii (2, 4, 10, 14, 9999 px) still contradict `DESIGN.md`'s
  "keep chrome at `rounded-sm`". Recorded, not fixed.
- The video is still sampled without aspect correction (`ascii-waves.tsx:118`), so
  the 16:9 source stays stretched on a 1.10:1 canvas. The user explicitly keeps the
  current look, so this stays as-is.
- The `.mp4` still ships an unused AAC audio track.
