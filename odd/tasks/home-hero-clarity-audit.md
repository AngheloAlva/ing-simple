# Home hero audit: measured evidence

Read-only audit of the home hero performed in a real browser against
`localhost:3000`. Every number below was measured, not inferred. Nothing was
modified. Kept as the evidence base for `odd/tasks/home-hero-clarity.md`.

Method: Playwright CLI (Chrome) for screenshots at 390 / 768 / 1024 / 1440 px in
light and dark; DOM geometry dumps; an overlap detector comparing the bounding
rects of every text-bearing leaf element; a clipping detector comparing
`clientHeight` against `scrollHeight`; and a hand-written PNG decoder in Node used
to sample real pixel colours for contrast ratios.

## Composition and geometry (1440 × 1200 viewport)

| Element | Measurement |
| --- | --- |
| Hero section | `0,0 1440×503` |
| Background canvas | `0,0 1440×1309` — ends in a hard horizontal edge |
| Window frame | `170,503 1100×590` (28 px title bar + 560 px body) |
| Tab list | `170,1117 1100×32` |
| Tab tracks | four bars of `266×4` at x = 170, 448, 726, 1004 → 12 px gaps |
| h1 | `384,160 672×123` |
| Hero paragraph | `432,299 576×52` |
| Radial vignette | `182,-126 1075×755`, `z-index:-1`, clipped by the hero section |

### Above the fold

At 1366×768 the frame runs `503 → 1093`. Only **265 px of its 590 px** are above
the fold, and the tab list at y=1117 sits **349 px below it**. The visible part of
the mockup is the title bar, the panel header, and roughly 230 px of empty canvas
with two node cards cut by the viewport edge.

### Tab tracks read as one line

Measured coverage of the track row: **96–97 % of pixels in the row are non-white**.
Twelve pixels of gutter on a 266 px bar (4.3 %) is not enough separation.

## Clipping caused by the fixed 560 px body

`components/window-frame.tsx:28` sets `h-[560px] overflow-hidden`.

| Viewport | Panel | Box | Content | Lost |
| --- | --- | --- | --- | --- |
| 390 | Desarrollo web | **1 px** | 194 px | The whole "Listado de Solicitudes" table |
| 390 | Capacitaciones | 217 px | 318 px | The fourth course card |
| 390 | Reportabilidad | 560 px | 677 px | 117 px |
| 1440 | Desarrollo web (sidebar) | 395 px | 629 px | 234 px: "Hispania", "Evaluación y Costos", "Planificación" |
| 1440 | Desarrollo web (table area) | 179 px | 459 px | 280 px; 3 visible rows out of the "1 - 10" the footer claims |

## Text-on-text overlaps

| Viewport | Collision | Overlap |
| --- | --- | --- |
| 390 | "Automatización de procesos" × "Lecciones completadas" | 140×7 px |
| 390 | "0 %" × "recién" | 19×15 px |
| 390, 1440 | "Código SC" / "Nombre del Proyecto" / "Cliente" × "Filas por página: 10" | 17–52×17 px |
| 390 | "Plan" × "Mantención", "Oper." × "Mantención" (waterfall) | up to 19×12 px |

## Duplicated titles

| Window chrome label | Panel heading | File |
| --- | --- | --- |
| "Flujo automatizado" | `<h2>Flujo automatizado</h2>` | `hero-showcase.tsx:34` / `panels/automation.tsx:402` |
| "Ruta de capacitación" | `<h2>Ruta de capacitación</h2>` | `hero-showcase.tsx:52` / `panels/training.tsx:83` |

## Contrast, sampled from real pixels

| Element | Text | Background | Ratio |
| --- | --- | --- | --- |
| Active tab label | `#0a0a0a` | `#fcfcfc` | 19.63:1 |
| Hero paragraph (`--muted-foreground`) | `#737373` | `#ffffff` | 4.74:1 |
| Inactive tab label, darkest stroke pixel | `#737373` | `#fcfcfc` | 4.62:1 |
| Inactive tab label, mean of 25 darkest pixels | `#7f7f7f` | `#fcfcfc` | 3.90:1 |
| **Ambient ASCII pattern, far left** | `#666469` | `#ffffff` | **5.85:1** |
| **Ambient ASCII pattern, far right** | `#666466` | `#ffffff` | **5.87:1** |

The decorative background carries **more** contrast than the hero paragraph and
more than the interface's own tab labels. The background wins the hierarchy.

## Background layer

`public/sample-video-2.mp4`: 854×480 (1.78:1), 8 s, 30 fps, H.264 with an unused
AAC track, 1 573 928 bytes. `components/ascii-waves.tsx:118` samples it with
`videoUV = snappedMuv / uResolution` and no aspect correction — the `aspect`
correction at line 68 applies only to the wave field. On a 1440×1309 canvas
(1.10:1) the source is stretched roughly 62 % vertically, which is the origin of
the diagonal "staircase" banding and the moiré. The shader's line 128
(`targetColor = uHasVideo ? col : …`) is why the glyphs carry the video's blue.

`hasCursorInteraction` defaults to true but the wrapper is `pointer-events-none`,
so the cursor interaction can never fire.

## Performance (localhost, no network latency)

| Metric | Value |
| --- | --- |
| First contentful paint | 416 ms |
| **Largest contentful paint** | **1668 ms — element: the h1** |
| Total transfer | 623 KB |
| Of which the decorative video | **547 KB** |
| Canvas | 1440×1309, `elementSize=9` → ~23 000 cells at 60 fps |

The LCP element is invisible until roughly 1.1 s because `components/hero.tsx:16`
pairs `initial="hidden"` (opacity 0) with `delayChildren: 0.35`. An element at
opacity 0 does not count as painted, so the LCP is deferred by design.

## Accessibility

- The carousel advances every 6 s and pauses only on mouse hover
  (`hero-showcase.tsx:65-96`; the comment at lines 60-64 states the focus pause was
  deliberately omitted). Touch and keyboard have no way to stop it — WCAG 2.2.2.
- Every tab's `aria-controls` points at a `hero-panel-*` id that is not mounted.
- Two `role="tabpanel"` elements coexist for the 300 ms crossfade.
- The tabpanel has no `tabIndex`.
- Three nested `<main>` landmarks: `panels/training.tsx:168`,
  `panels/reportability.tsx:624`, `panels/web.tsx:530`, inside the `<main>` at
  `app/page.tsx`. With Capacitaciones active, `document.querySelectorAll("main").length === 2`.
- 645 characters of fabricated data reach the accessibility tree with no
  `aria-hidden`.
- Text sizes inside the frame: 9 px (×2), 10 px (×2), 10.5 px (×6), 11 px, 12 px
  (×7), 14 px.
- Border radii inside the frame: 2 px (×12), 4 px (×6), 10 px (×8), 14 px (×5),
  9999 px (×12), against `DESIGN.md`'s "keep chrome at `rounded-sm`".

## Naming drift

`lib/services.ts` is the declared single source of truth and `DESIGN.md` forbids
hardcoding service names elsewhere. The hero keeps a parallel list:

| Canonical `title` | Canonical `shortName` | Hero tab | Window label |
| --- | --- | --- | --- |
| Reportabilidad y dashboards | Reportabilidad | Reportabilidad | Dashboard operacional |
| Capacitaciones | Capacitaciones | Capacitaciones | Ruta de capacitación |
| Desarrollo web | Desarrollo web | Desarrollo web | ERP a medida |
| Automatización de procesos | Automatizaciones | Automatizaciones | Flujo automatizado |

The tab labels happen to already match the canonical `shortName`; what is wrong is
that they are hardcoded in a parallel list and that the window chrome invents a
third name per service.

## Why the Capacitaciones panel does not land

It names the offer in the tab and then shows one learner's progress. There is no
subject (whose 65 %?), no duration, modality, level or instructor, and its course
names do not exist in `lib/services.ts:258-283`. "Bloqueado · 0 %" communicates a
limitation, `recién` repeats three times, the certificate uses green as a second
accent (forbidden by `DESIGN.md`), three different radii coexist in one panel, and
two large dead gaps sit inside a 560 px box that other panels overflow.
