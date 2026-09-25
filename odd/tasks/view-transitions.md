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

- **The directional boundary must be the page's sole root**, wrapping the entire returned
  fragment — scripts, `<span id="top">`, `<Nav>`, `<main>` and the footer. This was
  measured in a browser before any page was touched, with five throwaway probe routes
  (`/vt-probe/*`, since deleted). React fires `enter`/`exit` only when the boundary is the
  `first or last` node of the inserted or removed subtree, and a DOM element wrapped
  around it stops React attributing the change at all:

  | Shape | `startViewTransition` | `vt-fade` / `vt-slide` |
  | --- | --- | --- |
  | `<div>` wraps the `<ViewTransition>` | not called | — |
  | sibling before, nothing after | called | applied |
  | sibling before **and** after | called | **never applied** |
  | boundary first, sibling after | called | applied |
  | boundary is the page's sole root | called | applied |

  The practical consequence: wrapping only `<main id="main-content">` does not work,
  because `<InView><Footer /></InView>` follows it. Wrapping the whole return does. This
  is also why the nav sits inside the boundary and needs the isolation rules below.
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
- Back links: `components/case-study/detail-hero.tsx:55` (`/casos`) typed `nav-back`. The guías
d  detail page has no back link (`components/guias/article-header.tsx` renders only the
  kicker, title, description and metadata row), so returning from a guide relies on the
  browser back button or the nav's `Guías` entry. Browser back carries no transition type,
  so that return plays the shared morph but not the directional slide.
- Nav links: `SIMPLE_LINKS` (Casos, Guías, Sobre nosotros) and the four service dropdown
  rows become `next/link` with `transitionTypes`. This is deliberately inside the scope of
  the three flows even though the nav was not named by the user: the nav is the other door
  into the same three destinations, and leaving it on raw anchors would mean the same
  destination behaves differently depending on which link you use, and would give no typed
  `nav-back` for returning from a flow.
- **No `name` on any content wrapper.** The browser excludes every element carrying a
  `view-transition-name` from its ancestors' snapshots, so a persistent named boundary
  around page content would sit still while the rest of the page slid. Only the specific
  shared visuals carry names; everything else stays inside the page's directional group.
- Same-route lateral navigation (`/guias/[slug]` → another guide via `Siguiente leyendo`,
  `/casos/[id]` → another case via `Otros proyectos`) is left without an animation and is
  listed as pending follow-up. It is the one place the documented `key` + stable `name` +
  `share` pattern would apply, and it is incompatible with the page-level directional
  boundary for the reason above. Both components render text-only cards, so there is no
  shared visual to morph either.

### Flow: services

- Home side: `components/services-stack.tsx`, name the diagram wrapper
  `service-visual-${slug}` and wrap it in a named `<ViewTransition>` with `share`.
- Detail side: `components/servicios/hero.tsx`, same name on the diagram wrapper.
- Page level: `app/page.tsx` and `app/servicios/[slug]/page.tsx` wrap their whole
  return value in `DirectionalTransition`; the CTA link carries `nav-forward`.
- The name is per slug, so the four home cards mount four distinct names.

### Flow: guías

- Card side (`components/guias/explorer.tsx`): wrap the plate in
  `<ViewTransition name={viewTransitionName(GUIA_COVER_PREFIX, slug)} share="morph" default="none">`.
- Cover side (`components/guias/cover.tsx`): the same name, forwarded to the plate.
  `GuiaCover` gains a required `slug` prop, passed from `app/guias/[slug]/page.tsx`.
- The wrapper goes at the two call sites, **not** inside `components/illustration-plate.tsx`.
  That component is shared with servicios and nosotros, and a name inside it would mount
  more than once and make React throw.
- Both sides are the same asset at the same 16:9, so the morph is geometrically
  clean — this is the flagship case of the three.
- Page level: `app/guias/page.tsx` and `app/guias/[slug]/page.tsx`.
- `GuiasRelated` renders text-only cards, so detail → detail has no shared visual.

### The entrance conflict

A named shared element must be at its final visual state when the snapshot is taken,
otherwise the incoming frame is captured blank and the morph arrives out of nothing. Two
places on the detail side had a Motion entrance sitting exactly there:

- `components/servicios/hero.tsx` — the diagram wrapper was a `motion.div` animating
  `opacity 0, y 24 → 0`.
- `components/case-study/detail-hero.tsx` — the mockup frame wrapper was a `motion.div`
  carrying `fadeInUp`, which also starts at `opacity 0`.

Both become plain `<div>`s. The morph is now that element's entrance, so nothing is lost
when a pair forms; when no pair forms the element simply appears. On the list side no
equivalent change is needed: `ServicesStack` cards are plain elements, and in
`ScrollStack`'s below-`lg` flow layout the inline `transform`/`opacity`/`filter` are
cleared entirely.

Not covered by that fix, and to be judged in the browser: the service diagrams build
themselves on first view (`interactive-diagram.tsx`, `useBuild`/`useAutoBuild`), so the
incoming diagram's internal parts may still be at `opacity 0` when the snapshot is taken.
The `morph` recipe's mid-flight blur is what has to carry that.

### Flow: casos

- Card side (`components/casos/grid.tsx`) and detail side
  (`components/case-study/detail-hero.tsx`) wrap the mockup frame in a named
  `<ViewTransition>`: `case-visual-${id}`.
- The card plate is `aspect-[16/10]` and the detail frame has no fixed ratio, so the
  interpolated box distorts mid-flight. The `morph` recipe's `via-blur` image pair is
  what hides it; if it still reads badly in the browser, the fallback is to give the
  card plate the detail's ratio (`aspect-video`) rather than dropping the morph.
- Page level: `app/casos/page.tsx` and `app/casos/[id]/page.tsx`.
- `DetailRelated` renders text-only cards, so detail → detail has no shared visual.

## Risks

| Risk | Mitigation |
| --- | --- |
| Next 16.1.1 → 16.2.x breaks the build or a route | Upgrade is its own work unit with typecheck, lint, test and build before anything else lands |
| The directional boundary sits after DOM siblings and silently never fires | The boundary wraps the whole page return, and the five-shape matrix above was measured in a browser before any page was edited |
| Two same-named VTs mounted at once (plate reuse, related lists) | Names are opt-in and derived from ids; verified by clicking through related items |
| A persistent `name` on page content freezes that content while the page slides | No name is placed on a content wrapper; names are attached only to the shared visuals, where standing still during the slide is the intended effect |
| `ScrollStack` transforms poison the services morph | Browser verification of this flow specifically; documented fallback is to morph nothing in services and keep the slide |
| A named shared element is captured at `opacity 0` because a Motion entrance is running on it | The two such wrappers become plain elements (see *The entrance conflict*); the rest is judged from mid-transition screenshots |
| The services diagram has not finished building itself when its snapshot is taken | Mid-transition screenshots at ~120ms and ~300ms in task 8; the morph's `via-blur` is the intended cover |
| The nav blinks or slides | First-load-only entrance + persistent isolation CSS |
| Lenis fights route-change scroll restoration | Verify the destination lands at the top in a browser build |
| Transitions ignore `prefers-reduced-motion` | Explicit `::view-transition-*` rule in `globals.css` |

## Tasks

| # | Task | Evidence |
| --- | --- | --- |
| 1 | Upgrade Next to 16.2.x, `eslint-config-next` with it, and `@types/react` / `@types/react-dom` to `^19.3.0` | `typecheck`, `lint`, `test`, `build` all green on the upgrade alone |
| 2 | Add the transition infrastructure: `globals.css` section, `lib/view-transitions.tsx`, `lib/href.ts` + tests, reduced-motion rule | Unit tests for `isInternalHref`; CSS present and referenced |
| 3 | Stabilise the shell: nav first-load-only entrance + persistent isolation | Browser check: nav stays put during a transition |
| 4 | Make the flow links soft: `CutButton` and nav links, casos grid, guías cards, back links | Browser check: no full reload on the three flows |
| 5 | Services flow: named morph on both sides + directional page boundaries | Browser check of home → servicio and back |
| 6 | Guías flow: named plate morph at both call sites + directional boundaries | Browser check of `/guias` → guía and back |
| 7 | Casos flow: named morph on the mockup frames + directional boundaries | Browser check of `/casos` → caso and back |
| 8 | Verify: typecheck, lint, test, build, browser walkthrough of all three flows forward and back, reduced-motion pass; document pending follow-up | Recorded command output and browser evidence |

## Non-goals / pending follow-up

Still outstanding:

- **Same-route lateral navigation has no animation**: guide → guide through "Sigue
  leyendo", case → case through "Otros proyectos". The documented `key` + stable
  `name` + `share` pattern would fix it, and it cannot be combined with the page-level
  directional boundary, because a named wrapper is excluded from the page snapshot and
  would stop sliding. Both components render text-only cards, so there is no shared
  visual to morph either.
- **Untyped navigations animate nothing.** A link inside a guide body has no direction
  to claim, so its destination boundary resolves to `default: "none"` and the content
  swaps instantly. That is the deliberate consequence of a live root; adding a root
  cross-fade back would reintroduce the frozen snapshot the live root exists to avoid.
- **`components/case-study-feature.tsx` carries no shared-element name on purpose.**
  Its left panel is driven by hover state and its geometry is unrelated to the detail
  hero frame, so a morph would be a large distortion with no meaning.
- **All three guides are `draft: true`**, so `/guias` renders its empty state and
  `/guias/[slug]` prerenders no route in a production build. The guide journey is only
  reachable, and only verifiable, in `pnpm dev`.
- **No `loading.tsx` or `<Suspense>` boundary exists anywhere**, so there is no
  Suspense reveal to animate yet.
- **`Nav` and `Footer` are still rendered by each page** rather than living in
  `app/layout.tsx`. Both are correct as they stand — the nav is isolated by name and
  the footer is ordinary page content — but every page still mounts its own copy.
- **`components/react-bits/` is imported by nothing.** Dead vendored code, a
  candidate for the same removal `pixel-sculpt` got.

## The anchors that are still anchors

Every internal destination now goes through `next/link`. What remains, and why:

| Location | Nature | Why it stays an anchor |
| --- | --- | --- |
| `privacidad/page.tsx` ×4, `contacto-section.tsx`, footer "Contacto" column | `mailto:` | the browser owns the protocol |
| `privacidad/page.tsx:179` | `https://resend.com` | external |
| `footer.tsx` LinkedIn | external | external, carries `target` and `rel` |
| `skip-to-content.tsx` | `#main-content` | in-page; `smooth-scroll.tsx` intercepts `a[href^="#"]` |
| `guias/toc.tsx` ×2 | `#slug` | in-page heading jump |
| `guias/mdx-components.tsx` | hash and external branches | in-page hash must not open a new tab |
| `case-study-feature.tsx` rows | internal, but no shared-element name | soft navigation, hover-driven preview |
| `logo-loop.tsx` | conditional | its only consumer never passes an `href` |

## Evidence log

### Closing the anchor gaps

Commits `296ff52` (the footer and the related cases) and `f416c59` (the featured-case
rows and the duplicated helper). Between them, every internal destination on the site
now goes through `next/link`; the table above records what is deliberately still an
anchor and why.

Two decisions worth naming. The footer splits each entry on `isInternalHref`, because one
of its columns is a `mailto:` — the same rule `CutButton` already used, rather than a
second exception list. And the guide MDX module had grown its own `isInternalHref` with
the same name as the shared one and different behaviour; collapsing it needed a third
branch, since an in-page hash is not an internal path and would otherwise have been given
`target="_blank"`.

Verified in the browser:

| Check | Result |
| --- | --- |
| `/servicios/desarrollo-web` → related case, production | soft, top, morph pair, `-60px` forward |
| `/casos/otc-360` → footer `Casos`, production | soft, top, `+60px` back |
| `/` → footer service, production | soft, top, `-60px` forward |
| Home featured-case row, production | soft, top, `-60px` forward, no morph (by design) |
| Guide body link → `/servicios/automatizaciones`, dev | soft, top, no slide (untyped by design) |
| Guide body link → another guide, dev | soft, top |
| LinkedIn | `target` and `rel` intact |
| `#incluye` | still an anchor, still scrolls |

Only `/servicios/desarrollo-web` has related cases; the other three services render none,
so the related-case boundary is exercised on one route rather than four.

### Pre-implementation probe — where the boundary must sit

Before touching any page, four throwaway routes under `app/vt-probe/` were used to measure
React's placement rule against a real Next 16.2.12 dev server. The probe
(`/tmp/vt-verify.mjs`) patches `document.startViewTransition` before the click, samples
`document.getAnimations()` for the length of the transition, and reports whether the
navigation was soft. The animation names are the real assertion: `vt-fade` only appears
when a directional boundary actually fired, and the browser silently does nothing when it
did not.

| Shape | `startViewTransition` | `vt-fade` / `vt-slide` |
| --- | --- | --- |
| `<div>` wraps the `<ViewTransition>` | not called | — |
| sibling before, nothing after | called | applied |
| sibling before **and** after | called | never applied |
| boundary first, sibling after | called | applied |
| boundary is the page's sole root | called | applied |

Consequences: the boundary wraps the whole page return, not just `<main>`; and because the
nav ends up inside the boundary, its isolation CSS is load-bearing rather than optional.
The probe routes were deleted afterwards. `pnpm typecheck` and `pnpm test` were rerun after
the deletion.

### Follow-up fix — the destination page opened mid-scroll

Commit `fa516e0`, after the user reported that any link landed at the scroll
position they had left. Not caused by the transitions, but made visible by them:
before this branch almost every link was a full document load that recreated Lenis.

The cause is Lenis's own input handling — `onNativeScroll` only re-syncs while
`isScrolling` is `false` or `"native"`, so a native scroll arriving mid-animation is
ignored and the next frame writes the animated value back. Next's reset for a new
route is therefore undone, and Lenis finishes animating to the position it was
already heading for. Six runs out of six on `/casos` scrolled to 1800px landed at
1806px.

React amplifies it: effects are deferred until a view transition finishes, so by
the time an effect could react, the wrong position is already on screen. The fix is
`lenis.scrollTo(0, { immediate: true })`, whose immediate path writes the value,
calls `reset()` and lowers `isScrolling`. `shouldResetScroll` in `lib/scroll.ts`
excludes an unchanged pathname, a hash destination, and back or forward; it is a
pure function precisely because the browser behaviour cannot be asserted from a
node test environment.

Verified against a running build, after 6/6 reproduction before the change:

| Check | Result |
| --- | --- |
| `/casos` at 1800px, click a card, six runs | lands at 0 every time |
| Same, in a production build | lands at 0 every time |
| Back from the case detail | returns to the 1300px the visitor left |
| In-page `#incluye` | scrolls to the section |
| Cold deep link `/servicios/reportabilidad#incluye` | lands on the section |
| Reload while scrolled | keeps the restored position |
| Same, under `prefers-reduced-motion` (no Lenis) | lands at 0, unchanged |

### Task 2 — the vocabulary and the CSS recipes

Commit `9b80ce2`. `lib/view-transitions.ts` (plain data, consumed by server components),
`lib/href.ts`, and the `View transitions` block at the bottom of `app/globals.css`. Two
contract tests read the stylesheet directly, because the failure mode of a name or a class
going out of sync is silent.

### Task 3 — the shell

Commit `3ba1baf`. The header entrance runs on the first header of the session only, and the
header gets `view-transition-name: site-nav` plus the isolation rules. The first attempt
read the gating ref during render and the new `react-hooks/refs` rule rejected it, taking
the lint baseline from 24 to 25; a `useState` initializer that only reads, with the write in
an effect, is what landed.

### Task 4 — soft links

Commit `336e2b6`. `CutButton` renders `next/link` for same-origin paths and a plain anchor
for everything else, including the `#incluye`-style fragments that `smooth-scroll.tsx`
intercepts. Direction for the header is derived from the pathname by
`navLinkTransitionTypes`, because one link can point either way, and the three call sites
share one `navLinkProps` helper so the derivation runs once per link.

### Tasks 5–7 — the three journeys

Commits `006715a` (services), `345ed48` (guide), `1127480` (case). Each wraps its page
return in one directional boundary and names the shared visual on both sides.

Verified in the browser against both a dev server and a production build (`pnpm start` on a
spare port), one run per journey:

| Journey | Soft nav | `startViewTransition` | Slide/fade | Morph pair |
| --- | --- | --- | --- | --- |
| `/` → `/servicios/reportabilidad` | yes | 1 | `vt-fade`, `vt-slide` | `vt-via-blur` |
| `/guias` → `/guias/ia-en-procesos-…` | yes | 1 | `vt-fade`, `vt-slide` | `vt-via-blur` |
| `/casos` → `/casos/otc-360` | yes | 1 | `vt-fade`, `vt-slide` | `vt-via-blur` |

`vt-via-blur` is the load-bearing one: the class only reaches the image pair when a named
`share` pair actually formed, so its presence is the difference between "a transition ran"
and "the same element travelled".

Direction was proved rather than assumed, by reading the first keyframe of the slide
transition: forward out of `/casos` starts at `-60px` and the `nav-back` link out of
`/casos/otc-360` starts at `+60px`.

Also checked: the fixed header stays crisp and single ~124ms into a transition (what looks
like a second header is the outgoing page showing through the cross-fade), and under
`prefers-reduced-motion: reduce` all three animations report `duration: 0`.

Pre-existing and unrelated, found while reading console output: four React warnings about
kebab-case SVG props (`font-family`, `paint-order`, `letter-spacing`, `word-spacing`) come
from `components/case-study/visuals/*`. They reproduce on a direct page load with no
navigation, and were left alone.

### Post-implementation fix — the empty viewport

Commit `23cad25`. The directional rules delayed the entering fade until the exit finished,
which is the recipe's default and is right for a small element. With a live root the page
group is the only thing on screen, so that delay emptied the viewport at the handover.
Both fades now start together, and `lib/view-transitions.test.ts` fails if a delayed enter
reference comes back.

### Task 1 — upgrade to Next 16.2

Commits: `d4a67ae` (this plan), `0748cb0` (the upgrade).

Installed: `next@16.2.12`, `eslint-config-next@16.2.12`, `@types/react@19.3.0`,
`@types/react-dom@19.3.0`. Next's bundled React canary moved to
`19.3.0-canary-3f0b9e61-20260317`, which exports `ViewTransition` and
`addTransitionType` from **both** the client and the react-server channel, and
`next/link` now declares `transitionTypes?: string[]`
(`next/dist/client/app-dir/link.d.ts:183`) as do `push`/`replace`
(`app-router-context.shared-runtime.d.ts:14`).

| Check | Result |
| --- | --- |
| `pnpm typecheck` | pass |
| `pnpm test` | pass, 193 tests in 22 files |
| `pnpm build` | pass, 33 routes generated |
| `pnpm lint` | **24 errors, 11 warnings — pre-existing baseline, unchanged by this work** |

The lint baseline was established by swapping `eslint-config-next` back to
`16.1.1` and re-running: the same 35 problems in the same files (`react-hooks/set-state-in-effect`
in the diagram components, plus `no-img-element` and `exhaustive-deps` warnings).
No lint gate exists in this repository and none was added. `pnpm lint` is
consequently **not** an acceptance criterion for this feature; the baseline must
simply not grow.

Also observed and left alone: `pnpm peers check` reports `@types/node` unmet for
`vitest@5` (wants `^22 || >=24`, installed `20.19.43`). Pre-existing, unrelated to
this change, and out of scope.
