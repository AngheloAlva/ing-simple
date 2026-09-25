# View transitions for the three list → detail flows

## Goal

Add native view transitions (shared-element morph + directional slide) to the three
list → detail journeys:

1. Home services section → `/servicios/[slug]`
2. `/guias` → `/guias/[slug]`
3. `/casos` → `/casos/[id]`

The rest of the site stays out of scope and is tracked as pending follow-up at the
end of this document.

## Context

### The blocking finding

React `<ViewTransition>` only activates on **client-side** navigations. Today most of
the site uses raw `<a>` / `motion.a`, which forces a full document load and kills any
transition:

| Flow | Current link | Soft navigation |
| --- | --- | --- |
| Home servicios → `/servicios/[slug]` | `CutButton` → `<a href>` (`components/cut-button.tsx:153`), call site `components/services-stack.tsx:89` | no |
| `/casos` → `/casos/[id]` | `motion.a` (`components/casos/grid.tsx:40`) | no |
| `/guias` → `/guias/[slug]` | `next/link` (`components/guias/explorer.tsx:57`) | **yes** |

So the build order is: make the flow links soft, then add transitions.

### Version constraints (verified against the installed tree)

- Next `16.1.1` + `@types/react@19.2.17` do **not** expose `ViewTransition` or
  `addTransitionType` to TypeScript.
- At runtime Next aliases `react$` to `next/dist/compiled/react` (a canary build,
  `19.3.0-canary-f93b9fd4-20251217` in 16.1.1) which already exports both
  (`create-compiler-aliases.js:253`). Runtime works with no config; only types are
  missing.
- `transitionTypes` on `next/link` shipped in **Next 16.2.0**. Not present in 16.1.1.
- `@types/react@19.3.0` **does** declare `ViewTransition`, `ViewTransitionProps`,
  `addTransitionType`, and `ViewTransitionClassPerType`.

### Decisions taken by the user

- Scope: the three flows only. The rest of the web stays pending.
- Animation: **shared-element morph + directional slide**.
- Version: **upgrade to Next 16.2+** so `transitionTypes` is native on `<Link>`.

### Non-negotiables discovered in the audit

- `<ViewTransition>` only fires `enter`/`exit` when it is the outermost element of the
  inserted/deleted subtree, with no DOM node before it in its parent. Wrapping
  `<main>` while `<span id="top">` and `<Nav>` render before it will silently not
  animate. The directional boundary must wrap **the whole page return value**.
- The nav is `fixed` and is rendered by every `page.tsx`, not by the layout, so it
  remounts on each soft navigation and re-runs its `opacity 0 → 1, y -16 → 0`
  entrance. Without isolation the header would slide with the page and blink.
- `IllustrationPlate` is a shared component used by guías, servicios and nosotros.
  A view-transition name inside it must be **opt-in via prop**, never unconditional,
  or two call sites mount the same name and React throws.
- `ScrollStack` writes `transform`, `filter` and `clipPath` inline on every card each
  scroll frame. The services morph starts inside that tree, so it is the riskiest of
  the three and must be verified in a browser, not judged from code.

### Existing constraints to respect

- `prefers-reduced-motion` is handled in two places: `lib/motion.tsx`
  (`useReducedMotion`) and `app/globals.css:312` (clamps `animation-duration` and
  `transition-duration`). Neither covers `::view-transition-*` pseudo-elements, so
  view transitions need their own reduced-motion rule.
- Motion vocabulary: `softEase = [0.22, 1, 0.36, 1]`, entrances `0.6`–`0.7s`,
  `duration-300 ease-out` on hover. `DESIGN.md` §7 is the source of truth.
- Lenis smooth scroll is active (`lib/config.ts` `features.smoothScroll`). It
  intercepts `a[href^="#"]` only, but it owns the scroll rAF loop and needs to be
  checked against route changes.

## Design

### Infrastructure

`app/globals.css` gains one clearly delimited view-transition section:

- Timing variables following the guide's asymmetry: older content leaves faster than
  new content arrives.
- `nav-forward` / `nav-back` single-class enter+exit pair (slide + fade).
- `morph` shared-element recipe (controlled group duration, `via-blur` image-pair).
- `text-morph` for any shared element that is text rather than a plate.
- Persistent-element isolation for the site nav (`display: none` on the old snapshot,
  no animation on the new, `z-index` above sliding content).
- Live root: no root cross-fade, so unnamed content swaps instantly instead of
  freezing behind a stale snapshot.
- An explicit `@media (prefers-reduced-motion: reduce)` block zeroing every
  `::view-transition-*` duration.

`lib/view-transitions.tsx` exports:

- `DirectionalTransition` — a client wrapper carrying the type-keyed `enter`/`exit`
  map for `nav-forward` / `nav-back` with `default="none"`.
- The transition-type constants, so links and pages cannot drift apart.

`lib/href.ts` exports `isInternalHref(href)` plus unit tests: internal hrefs are
`/`-prefixed and not protocol-relative (`//`); everything else (`http`, `https`,
`mailto`, `tel`, `#`, `//`) renders as a plain anchor.

### Shell stability

- `components/nav.tsx`: the header entrance runs on the first load only. On later
  soft navigations the nav renders already visible, so the transition snapshot is not
  captured mid-fade.
- The nav carries a stable view-transition name, isolated by the CSS above.

### Flow: links

- `components/cut-button.tsx` renders `next/link` for internal hrefs and `<a>` for
  everything else, keeping the existing anchor props (`target`, `rel`, `onClick`).
  This is what makes Home → servicio soft. Side effect: the `/contacto` and `/casos`
  CTAs also become soft navigations; that is accepted and desirable.
- `components/casos/grid.tsx`: `motion.a` → `motion.create(Link)`, as
  `components/case-study/detail-related.tsx:15` already does.
- `components/guias/explorer.tsx`: forward type on the card link.
- Back links: `components/case-study/detail-hero.tsx:55` (`/casos`) and the guías
  article back link, typed `nav-back`.
- Related-item navigation inside the same dynamic route
  (`components/guias/related.tsx`, `components/case-study/detail-related.tsx`) moves
  between `/x/[slug]` segments: the router swaps keyed subtrees there, so the
  documented `key` + stable `name` + `share` pattern is required or nothing fires.

### Flow: services

- Home side: `components/services-stack.tsx`, name the diagram wrapper
  `service-visual-${slug}` and wrap it in a named `<ViewTransition>` with `share`.
- Detail side: `components/servicios/hero.tsx`, same name on the diagram wrapper.
- Page level: `app/page.tsx` and `app/servicios/[slug]/page.tsx` wrap their whole
  return value in `DirectionalTransition`; the CTA link carries `nav-forward`.
- The name is per slug, so the four home cards mount four distinct names.

### Flow: guías

- `components/illustration-plate.tsx` gains an optional `transitionName` prop; when
  absent nothing changes for the other call sites.
- Card side (`components/guias/explorer.tsx`): `guia-cover-${slug}`.
- Cover side (`components/guias/cover.tsx`): same name.
- Both sides are the same asset at the same 16:9, so the morph is geometrically
  clean — this is the flagship case of the three.
- Page level: `app/guias/page.tsx` and `app/guias/[slug]/page.tsx`.

### Flow: casos

- Card side (`components/casos/grid.tsx`) and detail side
  (`components/case-study/detail-hero.tsx`) wrap the mockup frame in a named
  `<ViewTransition>`: `case-visual-${id}`.
- The card plate is `aspect-[16/10]` and the detail frame has no fixed ratio, so the
  interpolated box distorts mid-flight. The `morph` recipe's `via-blur` image pair is
  what hides it; if it still reads badly in the browser, the fallback is to give the
  card plate the detail's ratio (`aspect-video`) rather than dropping the morph.
- Page level: `app/casos/page.tsx` and `app/casos/[id]/page.tsx`.

## Risks

| Risk | Mitigation |
| --- | --- |
| Next 16.1.1 → 16.2.x breaks the build or a route | Upgrade is its own work unit with typecheck, lint, test and build before anything else lands |
| The directional boundary sits after DOM siblings and silently never fires | Boundary wraps the whole page return; verified in a browser, not from code |
| Two same-named VTs mounted at once (plate reuse, related lists) | Names are opt-in and derived from ids; verified by clicking through related items |
| `ScrollStack` transforms poison the services morph | Browser verification of this flow specifically; documented fallback is to morph nothing in services and keep the slide |
| The nav blinks or slides | First-load-only entrance + persistent isolation CSS |
| Lenis fights route-change scroll restoration | Verify the destination lands at the top in a browser build |
| Transitions ignore `prefers-reduced-motion` | Explicit `::view-transition-*` rule in `globals.css` |

## Tasks

| # | Task | Evidence |
| --- | --- | --- |
| 1 | Upgrade Next to 16.2.x, `eslint-config-next` with it, and `@types/react` / `@types/react-dom` to `^19.3.0` | `typecheck`, `lint`, `test`, `build` all green on the upgrade alone |
| 2 | Add the transition infrastructure: `globals.css` section, `lib/view-transitions.tsx`, `lib/href.ts` + tests, reduced-motion rule | Unit tests for `isInternalHref`; CSS present and referenced |
| 3 | Stabilise the shell: nav first-load-only entrance + persistent isolation | Browser check: nav stays put during a transition |
| 4 | Make the flow links soft: `CutButton`, casos grid, guías cards, back links, same-route related pattern | Browser check: no full reload on the three flows |
| 5 | Services flow: named morph on both sides + directional page boundaries | Browser check of home → servicio and back |
| 6 | Guías flow: opt-in plate name on both sides + directional boundaries | Browser check of `/guias` → guía and back |
| 7 | Casos flow: named morph on the mockup frames + directional boundaries | Browser check of `/casos` → caso and back |
| 8 | Verify: typecheck, lint, test, build, browser walkthrough of all three flows forward and back, reduced-motion pass; document pending follow-up | Recorded command output and browser evidence |

## Non-goals / pending follow-up

Deliberately left out of this change, to be picked up as a separate one:

- Nav dropdown, footer, `case-study-feature.tsx` (home featured case),
  `servicios/related-cases.tsx` and the lateral pages (`/sobre-nosotros`,
  `/contacto`, `/privacidad`) still navigate with hard anchors.
- No `loading.tsx` or `<Suspense>` boundary exists anywhere, so there is no Suspense
  reveal pattern to build yet.
- The `Nav` and `Footer` remain per-page rather than moving into `app/layout.tsx`.
- `ThemeSwitch` is fixed and outside the page boundary; it needs its own isolation
  check once the full site is converted.

## Evidence log

_(appended as tasks close)_
