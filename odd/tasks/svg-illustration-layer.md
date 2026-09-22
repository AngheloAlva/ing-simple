# Illustration layer for the `img/about` raster family

## Goal

Replace the four off-brand raster images in `public/img/about/` with on-brand
illustration that the existing duotone treatment can carry convincingly, and cut
the 6.4 MB of asset weight.

## Context

Read-only audit (2026-09-21) of where a new illustration layer would pay off.
The conclusion inverted the original question: the site does not lack
decoration, it has exactly one asset family that fights the design system.

`public/img/about/{power-bi,power-platform,training,web}.png` are 6.4 MB of
glossy 3D renders in teal and violet — the generic AI-generated corporate look,
and colours DESIGN.md §2 forbids. Both consumers neutralise that palette by
destroying it:

- `components/nav-visual.tsx` paints `var(--brand-blue)` and applies
  `grayscale mix-blend-luminosity` to the photo.
- `components/nosotros/story.tsx:202-207` applies `filter:grayscale(1)` plus
  three stacked `mix-blend-color/multiply/screen` layers with hardcoded hex
  values, tuned by a comment that explains the calibration workaround.

Only luminosity survives that stack. The palette is filtered away because it
cannot be used. The same four files feed `lib/services.ts` (`image` field, lines
105, 223, 340, 461), so one asset family covers two surfaces.

## Route decision (2026-09-21)

The vector route is abandoned. Two falsifications on the QuiverAI web app:

1. An icon brief produced a monitor outline containing four bordered panels — a
   mute wireframe, forbidden by DESIGN.md §8.
2. A corrected editorial brief asking for hand-drawn ink, heavier contours,
   solid ink masses and three-quarter perspective produced an empty SVG.

Working conclusion: the model is competent at marks, icon sets, patterned
identity graphics and flat-colour poster illustration — the register its own
gallery shows — while editorial line illustration with figures and
three-quarter perspective is out of distribution. The register it does handle
well is the register DESIGN.md forbids, so no prompt fixes this.

Adopted route instead: **raster illustration generated with an OpenAI image
model, one asset at a time, piloted on the first chapter before any commitment.**
OpenAI image models are strong at exactly the register QuiverAI failed on.

Consequences to accept:

- Output is PNG, not SVG. `currentColor` inheritance is lost, and
  `next/image` keeps working unchanged.
- The story duotone filter stack stays. It is no longer removable, and that is
  intentional.
- The deliverable is a neutral ink drawing whose **luminosity range** the
  duotone stack can carry. Quality now depends on that range, not on the
  drawing's colour.

## Scope

- `public/img/about/*` — four replacement illustrations.
- `lib/services.ts` — the four `image` fields, if the file extension or name
  changes.
- `components/nosotros/story.tsx` — image element only, if dimensions require it.
- `components/nav-visual.tsx` — the tile treatment, only if the pilot shows the
  luminosity blend fails on line art.

## Constraints

- **Fully transparent background.** This is now the hardest requirement, because
  the nav tile composites the asset with `mix-blend-luminosity` over a solid
  `var(--brand-blue)` field: a white box would turn the whole tile white. If the
  generator refuses transparency, request a plain pure white ground instead and
  strip it programmatically before integration.
- **Neutral ink.** Pure black contour lines plus at most two flat mid-grey
  tones. No colour of any kind, because the duotone stack supplies the hue and
  the asset supplies the luminosity. A coloured asset is wasted.
- **Enough tonal range to survive.** The stack collapses near-white artwork into
  a flat blue rectangle — that failure is already documented in the
  `story.tsx:203-208` comment. The drawing must carry real dark, mid and light
  masses.
- Flat illustration, not a render: no gloss, no glow, no gradients, no plastic
  surfaces, no photorealism. The whole point is to leave the 3D-render register
  behind.
- No text, letters, numbers or logos inside the artwork. Diagrams in this site
  carry real names and results (DESIGN.md §8); a generative model may not invent
  data, so the artwork stays wordless.
- No interface panels, no empty boxes, no grid of rounded rectangles: that is
  the failure mode of attempt 1, and it reads as a mute wireframe.
- Cliché ban: no gears, no lightbulbs, no rockets, no handshakes, no targets with
  arrows, no magnifying glasses over puzzle pieces, no floating icons, no smiling
  figure facing the viewer.
- Aspect ratio: square or 4:3. Never 16:9 or portrait. The asset must survive
  `object-cover` into both a 16/9 frame and a ~square nav tile, so the subject
  stays centred inside a safe area with at least 18% empty margin all round.
- Weight target: under ~250 KB per file after the generator's output is
  re-encoded. The current files are 1.6 MB each.

## Non-goals

- Do not illustrate the diagrams (`components/diagrams/*`,
  `components/guias/diagramas/*`). They must show real names and results.
- Do not touch `components/hero.tsx`; the hero already carries HeroWaves plus
  HeroShowcase.
- Do not mass-replace the 52 files importing `lucide-react`. DESIGN.md §12
  records the icon gap, but a bulk swap inflates review workload with no
  proportional gain.
- Do not remove the duotone stack. With a raster asset it is load-bearing.

## Tasks

- [x] Generate the first illustration (Power BI / reportabilidad) and review the
      register before generating anything else.
- [x] Verify the transparency and the tonal range against the story and nav
      treatments.
- [x] Pilot: integrate that one asset into the story timeline and the nav.
- [x] Visual check of both themes in the browser, by the user: approved. No
      aspect tuning needed; the drawing reads at the right size in the 16/9
      frame.
- [x] Nav tile treatment: resolved. `mix-blend-luminosity` over the plate reads
      correctly, and because the tile is scoped with `data-service` the
      illustration lands on Reportabilidad's Power BI amber without knowing
      anything about services.
- [ ] Confirm the served weight: `next/image` re-encodes to WebP/AVIF, so the
      6.4 MB of source PNGs may never have reached the user. Re-measure and
      correct the weight argument in this document if it does not hold.
- [x] Generate and integrate the remaining three assets. `pnpm typecheck` clean,
      200 tests in 22 files passing, diff read line by line.
- [x] Replace the four originals and drop the `-v2` suffix. The old rasters were
      deleted and the four new assets renamed to the original names, so git reads
      them as four modified files rather than four deletions plus four additions:
      the history says "the four images were replaced", which is the truth.
- [x] `lib/guias/schema.test.ts:87` needed no change after all. It names
      `/img/about/web.png`, which exists again.
- [ ] Decide the ASCII confluence point, if any: see "The ASCII layer" below.
- [ ] Visual check of the three new chapters on `/sobre-nosotros` and in the
      dropdown, both themes.
- [ ] Verify: typecheck, scoped lint, focused tests.

## Risks

- Generic corporate illustration is its own flavour of ugly. Mitigated by the
  faceless figure, the specific desk props and the cliché ban, but this is the
  main reason to review one asset before generating four.
- If the drawing is too light, the duotone stack flattens it into a blue
  rectangle. Check the mid-tones, not just the outlines.
- Transparency may come back as a white plate, which would break the nav tile
  rather than the story frame. Check the nav first.

## Pilot verification — asset 1, `power-bi-v2.png`

Measured with a stdlib PNG decoder (`/tmp/pngcheck3.py`, `/tmp/pngcheck4.py`),
2026-09-21. 1254 x 1254, colour type 6, bit depth 8.

| Gate | Measurement | Verdict |
| --- | --- | --- |
| Transparent background | 68.6% alpha 0, 30.0% alpha >= 240, 1.4% antialiasing ramp | pass |
| Opaque ink, not translucent | 28.9% of pixels at alpha >= 250 | pass |
| Neutral, no watermark | 0 pixels with channel spread > 12 above alpha 128; max spread 10 | pass |
| Tonal range | dark 52.5%, mid 24.3%, light 23.2% | pass |
| File weight | 787 KB | see below |

The tonal range is the whole point. The current 3D renders sit on a near-white
ground, which is why the comment at `story.tsx:203-208` records them collapsing
into a solid blue rectangle. A drawing with 52.5% dark mass does not.

**Composition finding.** Content margins are 9.4% left, 9.5% right, 15.5% top,
11.1% bottom. In the story frame (16/9, source 1/1) `object-cover` crops 44% of
the height, which would cut roughly 80px off the plant and 135px off the chair
and feet. Required change: `object-cover` to **`object-contain`** in
`story.tsx:202`. With a transparent background the change is visually free,
because there is no background to letterbox: the container's `#e6eeff` ground
simply shows around the drawing, exactly as it already did.

**Open, browser-only.** 23.2% of the ink is near-white (the screen, the papers,
the mug). Under `mix-blend-luminosity` over `var(--brand-blue)` those regions
become near-white on blue, so the nav tile may read pale instead of as a solid
blue plate. That is a visible change to the dropdown and has to be looked at.

**Correction, and a second one.** Two claims of mine were wrong here, in opposite
directions. First I said the swap would cut the weight. Then I said the 6.4 MB
never reached the user and that the page was already fine. Both were guesses.
The measurement is in **Served weight, measured** below and it says the served
weight went up 2.4-2.7x under the default WebP, and that enabling AVIF removes
that cost entirely and turns the swap weight-neutral.

## Verification — all four assets

Measured 2026-09-21 with the same stdlib decoder. All four pass every gate.

| Asset | KB | alpha 0 | ink >= 240 | dark / mid / light | colour spread |
| --- | --- | --- | --- | --- | --- |
| `power-bi-v2` | 787 | 68.6% | 30.0% | 52.5 / 24.3 / 23.2 | 10 |
| `power-platform-v2` | 706 | 72.3% | 24.8% | 57.8 / 22.4 / 19.8 | 13 |
| `training-v2` | 893 | 63.1% | 33.9% | 57.4 / 22.1 / 20.4 | 13 |
| `web-v2` | 908 | 62.5% | 34.4% | 53.1 / 24.3 / 22.6 | 11 |

Transparent backgrounds, opaque ink, no colour above a channel spread of 13, and
a tonal distribution close to identical across all four. That last column is what
matters: the duotone stack receives the same signal range from every asset, so the
four chapters read consistently with no per-image tuning.

Content margins, which `object-contain` makes non-critical but which would matter
if the `aspect-[16/9]` container is ever changed, as left / right / top / bottom:
`power-platform` 10.8 / 15.3 / 8.3 / 6.4, `training` 8.6 / 5.4 / 17.1 / 7.9,
`web` 7.8 / 3.8 / 15.9 / 8.4. `web-v2` has only 3.8% on the right, so a return to
`object-cover` would crop it.

Total: 3.29 MB against 6.4 MB for the four originals.

Register, judged by looking: `power-platform-v2` resolves the frame-escape gesture
best, with the paper band rising from the tray and leaving the top-right corner
while the sheets detach. `training-v2` solved the grid hazard exactly as briefed —
one large video window plus one small one and a row of four round call controls,
with a webcam on the monitor and the hand-drawn bar chart in the notebook.
`web-v2` shows the same page in the monitor and reflowed to one column on the
phone. The set reads as a set: same framing, same plant, same mug, same notebook
and pen, same paper stack.

## Pilot integration — 2026-09-21

Two files changed: one path in `lib/services.ts` and the treatment in
`components/nosotros/story.tsx`. Verified: `pnpm typecheck` clean, `pnpm test`
200 tests in 22 files passing, and the diff read line by line.

Two decisions were taken beyond the announced object-fit change, both forced
rather than chosen:

1. **Dark mode had to invert, not compress.** The drawing's dominant ink value
   sits near luminance 15/255. Through the existing dark-mode filters
   (`contrast(1.35)` then `brightness(0.4)`) it lands at 0, while the composited
   ground lands near luminance 15. That is roughly 1.1:1, i.e. invisible.
   Inverting is the only arrangement that survives a dark ground, so the ink
   becomes the light mass and the filled areas become the dark ones.
2. **The treatment became per-chapter instead of shared.** Changing the filter
   on the shared container would have degraded the three chapters still using the
   near-white 3D renders, for which `brightness(0.4)` is correct. The per-asset
   flag follows the idiom already in the repo at `components/trusted-by.tsx`, where
   a `blend?: boolean` selects between two treatment constants.

Open visual questions, to be settled by looking rather than by reasoning:

- In the 16/9 frame a square asset fitted with `object-contain` occupies only
  about 56% of the width, so the drawing may read as small against wide empty
  margins. The knob is the container aspect: `aspect-[16/9]` to `aspect-[4/3]`
  raises that to about 75%.
- The nav tile applies `mix-blend-luminosity` over `var(--brand-blue)`, taking
  the drawing's luminosity and the plate's hue. Whether that reads as a blue
  duotone or washes out is unknown.

## Delivered shape

The whole change is one component plus four assets. Nothing else moved.

```
M  components/nosotros/story.tsx
M  public/img/about/power-bi.png
M  public/img/about/power-platform.png
M  public/img/about/training.png
M  public/img/about/web.png
```

`components/nosotros/story.tsx` carries an optional `lineArt?: boolean` on the
`Chapter` interface, the two treatment constants `RENDER_FILTER` and
`LINE_ART_FILTER`, `lineArt: true` on the four chapters, and a ternary on the
`<Image>` className. Nothing else in the file changed.

`lib/services.ts` ends with **zero diff**. It was edited twice on the way — once
to point Reportabilidad at the pilot asset and once per service once the
remaining three arrived — and then the `-v2` suffix removal returned all four
values to exactly what was committed. The service list now names the same four
paths it always did, and they resolve to the new art. The nav tiles pick the new
illustrations up for free, with no code change at all.

Verification run after the rename: `pnpm typecheck` clean, `pnpm test` 200 tests
in 22 files passing, no `-v2` string left anywhere under `app/`, `components/` or
`lib/`, and every referenced `/img/about/` path confirmed present on disk at its
expected size.

## The ASCII layer

The site already carries a second visual language besides the diagrams: ASCII
character fields. It is rendered in `components/ascii-waves.tsx` (hero, final
CTA) and `components/react-bits/pixel-sculpt.tsx` (guide covers). Two more ASCII
renderers exist, are complete, and have **zero consumers**:

- `components/ascii-portrait.tsx`, 204 lines. Takes an image `src` and renders
  it as a character grid over the ramp `" .:-=+*oahkbd#WM"`. This is, literally,
  "turn this illustration into ASCII".
- `components/ascii-icon.tsx`, 204 lines. Converts SVG paths into a character
  grid. `lib/services.ts` already declares a `shape` per service (`"bars"`,
  `"plus"`, `"scan"`, `"bolt"`) and imports the `Shape` type from it: the data
  and the renderer are both wired, and nothing renders them.
- `components/react-bits/ascii-ripple.tsx`, 837 lines, with its own test file and
  no consumer. Left over from the CTA iteration that `AsciiWaves` replaced.

That is 1,245 lines of unused ASCII machinery, two pieces of which are exactly
the bridge between the ink register and the system register.

**How the two registers combine.** Not side by side. The illustration and the
ASCII are the same signal at two quantisations: the ink drawing is the
high-fidelity view, the character grid is that same image quantised onto the
system's cell grid. One asset, two renderings, and the transition between them is
the fusion. That is what stops the illustration from being a foreign body: it
acquires a representation in the language the rest of the site speaks.

**Placement rule.** The register follows the section's job.

| Register | Job | Surface |
| --- | --- | --- |
| Diagram | data with real names and a result | challenge, process, includes, metrics |
| ASCII | ambient field and system texture | hero, final CTA, transitions |
| Illustration | narrative and people | story timeline, case studies |

Hard rule: never two registers in the same element. No ASCII field behind a
drawing, no illustration inside a diagram.

**The risk in "add more of this style".** Repetition only produces coherence
when it happens on the same kind of surface. Three more chapters on the story
timeline are the same surface and add system. An illustration in the FAQ, on
`/contacto` or in the hero is a different surface and adds decoration, which puts
the page back to "why is there a little drawing here".

## Asset brief — the series device

The first asset established a register that works. The remaining three must read
as the same series, and three independently prompted images will not. Three
devices hold the set together:

1. **Same framing.** A person seen from behind in three-quarter view at a
   workspace, with one shoulder or the chair back overlapping the near edge of
   the desk. That overlap is what creates the depth, and it is the difference
   between an illustration and an icon.
2. **Shared prop kit.** The potted plant, the mug, the open notebook with a pen
   resting on it, and a small stack of loose papers recur in every scene. The
   plant is the strongest anchor. Each chapter adds its own specific object on
   top of the kit.
3. **One gesture per scene where a key object escapes its own frame.** For Power
   BI it was the chart line running off the monitor with an arrow. For
   automatición it is the paper band leaving the top-right corner; for
   capacitaciones, the last bar of the board chart passing the board's edge; for
   desarrollo web, the page unwinding over the front edge of the desk. This
   gesture is what stops the drawing from collapsing back into a bordered panel.

Style block that produced the approved register, to repeat verbatim in all
there:

```
Flat two-colour editorial illustration, hand-drawn ink style. Confident black
contour lines with a few surfaces filled in flat pure black, plus exactly two
flat mid-grey tones for shading. No other colours anywhere. No gradients, no
glow, no glossy or plastic surfaces, no 3D render, no photorealism, no painterly
texture. Isolated on a fully transparent background.
```

Per-chapter subjects:

- **power-platform-v2.png** (2024, Automatización de procesos): a person standing
  in three-quarter view, seen from behind and to the side, holding a tablet with
  a filled-in form at chest height and tapping it; on a desk at the left a paper
  tray from which three loose sheets rise in an arc, joined by one continuous
  band that curves up and leaves the top-right corner.
- **training-v2.png** (2024, Capacitaciones): a person seen from behind in
  three-quarter view, seated at a desk, facing a widescreen monitor carrying a
  video call: one large video window plus one smaller one in a corner and a row
  of round call controls, never a grid of many windows. In the notebook on the
  desk, a bar chart drawn by hand in pencil whose last bar runs past the edge of
  the page. The user chose the video-call direction; the hand-drawn chart carries
  the series gesture and keeps the scene about accompaniment rather than about
  the call software. Note the copy nowhere promises a certificate, so the
  artwork must not show one.
- **web-v2.png** (2025, Desarrollo web): a person seen from behind in
  three-quarter view, seated at a desk, facing a widescreen monitor that shows a
  realised page — a wide photograph block across the top, a headline line, two
  columns of text rows — with a phone on the desk showing the same page reflowed
  into one narrow column. The user settled the constraint first: no
  infrastructure iconography (servers, databases, connected clouds, pipelines),
  because that is the diagram register and two registers must never share an
  element.

  This is the one scene in the set without a frame-escape gesture, and that is
deliberate. The gesture exists to stop a drawing collapsing into a bordered
panel, and here the page's own content does that job: a photograph block, a
headline and two columns of text are already a real thing rather than mute
boxes. Adding a clever gesture on top would risk the vague-ribbon failure again.
If the base reads well, a gesture can be added later once we can see it.
- **web-v2.png** (2025, Desarrollo web): a person seen from behind in
  three-quarter view, seated and working on a laptop, one hand on the trackpad;
  a generous open page unwinds from the screen and curls down over the front edge
  of the desk toward the bottom of the frame.

Rejected on 2026-09-21: the user judged the training and web results
incomprehensible, and "a long page unwinding over the desk" was the cause for
web. A continuous abstract band is not a recognisable object, so the model has
nothing to draw and produces a vague ribbon. Lesson: every frame-escape gesture
must involve a concrete, nameable object (`power-bi` worked precisely because the
line ended in an arrowhead).

## Attempt log

Three generation attempts, 2026-09-21, all rejected.

1. **QuiverAI, icon brief.** Style block asked for "flat orthographic front
   view", "single uniform stroke weight", "no fills", "squared corners"; subject
   was a noun list of UI elements. Output: a monitor outline containing four
   bordered panels. A mute wireframe. Root cause was the brief, not the model.
2. **QuiverAI, corrected editorial brief.** Lifted all four icon constraints,
   asked for heavier contours, solid ink masses, overlapping forms and
   three-quarter perspective; subject was a figure at a desk. Output: an empty
   SVG.
3. **Route change.** Vector abandoned; OpenAI raster pilot adopted.

## Served weight, measured

Measured 2026-09-21 against a production build (`pnpm build`, `next start`) by
requesting the optimizer endpoint directly for each asset at each width, both old
and new. The originals were extracted from `31355b3` into a temporary directory
under `public/`, so both sets went through the same optimizer at the same
source dimensions: everything is 1254x1254. That directory was deleted after the
measurement.

### What the browser actually receives

| Asset, w=1080 | old, WebP | new, WebP | new, AVIF |
| --- | --- | --- | --- |
| `power-bi` | 41.9 KB | 107.5 KB | **38.7 KB** |
| `power-platform` | 56.6 KB | 110.8 KB | **42.0 KB** |
| `training` | 49.1 KB | 123.5 KB | **47.3 KB** |
| `web` | 47.1 KB | 125.4 KB | **47.3 KB** |

Totals for the four: old WebP 194.7 KB, new WebP 467.2 KB, new AVIF 175.3 KB.

### The finding, which inverted the argument twice

**Under the default WebP the new illustrations are 2.4-2.7x heavier served than
the rasters they replaced.** They are high-frequency line art on transparency:
hard edges, hatching in the hair and foliage, and an alpha channel. That is the
content WebP handles worst, and it is the opposite of the soft, low-detail,
near-white renders it replaces, which compressed beautifully.

The repository did not reveal this because `next.config.ts` has no `images` key
at all, so Next defaults to `formats: ["image/webp"]` and never offered AVIF.

**With AVIF enabled the picture reverses.** The new assets land at 38-47 KB
against 107-125 KB as WebP, a 62% drop, and the four together total 175 KB against
the 195 KB the rasters were costing. So the swap becomes weight-neutral to
slightly positive, while delivering artwork that belongs to the design system.

The old rasters also benefit, 14-24% lighter, so this is a site-wide win rather
than a patch for this change.

The usual objection to AVIF is encode cost. Measured here it is 0.13-0.20 s cold
per image and 0.002 s once cached, on 1254px sources. The second request for the
same URL returned the identical 47,292 bytes in 0.002 s.

### Other measurements worth keeping

- Non-negotiated fallback is PNG: new 102.8 KB against old 473.6 KB at w=1080, so
  in the un-negotiated case the new art is 4.6x lighter. Without AVIF, WebP is
  the format that decides, and there the new art is heavier.
- `next/image` only accepts configured quality values. The default is `[75]`, so
  `q=50` or `q=90` return a 44-byte error. Tuning quality needs
  `images.qualities`, and the quality sweep could not run without it.
- Local `cwebp` at q=75 reproduces Next's WebP output within 3% (109,966 against
  107,508 bytes for `power-bi` new, 40,372 against 41,884 for old), which is why
  the offline AVIF comparison was trusted before being confirmed through Next.
- Width matters linearly: new `power-bi` at w=640 is 51.5 KB, at 828 is 75.9 KB,
  at 1080 is 107.5 KB. Capping the served width would also have worked, at a
  visible cost in sharpness, and is no longer needed.

## Problem-scene family (second asset family, in progress)

The four illustrations shipped so far depict the company's own milestones, and they
live in exactly one place: the story timeline on `/sobre-nosotros`, plus the nav
dropdown tile on hover. That is one page template out of nine, and about one real
page out of roughly thirty-five. A visual register confined to a single page reads
as a different site rather than as part of this one, which is what the user
reported as "ahora se ve que rompen la página".

Reusing the four existing assets on the service pages was considered and rejected.
They depict 2023-2025 milestones, so placing one under the heading "El informe del
mes se arma a mano y la decisión ya se tomó" asserts the opposite of what the
section says. Cheap and wrong is worse than expensive and right.

So: a second family, one per service page, depicting that service's client problem,
for the section that opens with the `Kicker` "El problema"
(`components/servicios/problem.tsx`). That section is two text columns and no image
today.

Same three series devices as before: identical framing, the shared prop kit, and one
gesture where a key object escapes its own frame.

Subjects, each taken from that service's own problem copy:

- `reportabilidad` — "El informe del mes se arma a mano y la decisión ya se tomó":
  one person alone at a long table at the end of the day, surrounded by leaning
  stacks of printed reports, with three other chairs at the table pushed in and
  empty. Gesture: the tallest stack stands higher than the monitor and spills over
  the near edge of the table.
- `capacitaciones` — "Pagas por herramientas potentes y usas una fracción": a person
  kneeling in front of a large open tool case, holding one single tool while every
  other one sits untouched.
- `desarrollo-web` — "La operación creció y las herramientas no acompañaron": a
  person walking with an absurd stack of folders, papers and a phone balanced on
  top, already tipping over.
- `automatizaciones` — "Horas de tu equipo en trabajo que una máquina haría mejor":
  someone copying numbers with a pencil from a printed sheet into a laptop, an
  oversized stack of identical forms beside them. Gesture: the column of numbers
  leaves the edge of the printed sheet.

Assets will live at `public/img/problemas/<slug>.png`.

Pilot first. Two of the four assets in the first family needed a second generation,
so this register gets validated on `reportabilidad` before the other three are
produced.

## The plate, and a test-config defect it surfaced

Shipped together: `components/illustration-plate.tsx`, the shared framed plate that
owns the duotone ground, the treatment filters and the three blend layers.
`story.tsx` now renders through it instead of hand-rolling the same stack, and the
service problem section renders its band through it too. Two call sites, one
implementation.

The plate takes `frame` for the aspect, border and margin, and merges `className`
last so a call site can override the fit. That ordering is load-bearing: the service
band needs `object-cover` where the story timeline needs `object-contain`. The
resolved output is visible in the served HTML as
`class="[filter:grayscale(1)_contrast(1.1)] dark:[filter:grayscale(1)_contrast(1.1)_invert(1)] object-cover"`,
with no `object-contain` left, so the merge behaves as designed.

Two deviations the writer had to make, both forced by `exactOptionalPropertyTypes`:
`lineArt={chapter.lineArt ?? true}` in `story.tsx` and `image?: string | undefined`
in `problem.tsx`. Neither changes behaviour.

**A test-config defect surfaced while verifying.** The suite went from 22 files and
200 tests to 44 and 400, exactly double. Cause: `vitest.config.ts` excluded
`node_modules/**` and `.next/**` but not `.git/**`, and
`.git/gentle-ai/candidate-views/<id>/` holds a full frozen copy of the tree from the
native review of this session, including all 22 test files. The verbose reporter
returned 200 lines from `candidate-views`. So the suite ran twice and one of the two
runs tested a frozen snapshot instead of the working tree, which would make a stale
copy's failure look like a real one. Fixed by adding `.git/**`; counts are back to 22
and 200. The candidate view itself cannot be deleted, because `review dispose-result`
is unsupported pending design, so the exclusion is the only defence.

**Plate weight, measured.** In AVIF: 49.4 KB at 1080, 55.0 KB at 1200, 60.9 KB at
1920 and 60.9 KB at 3840. The last two are identical because the source is 1254px, so
Next cannot serve more than that and the plate's cost is capped near 61 KB whatever
the browser asks for. The honest caveat: the band can reach 1360 CSS px from a 1254px
source, so at DPR 2 it is undersampled by roughly half and will read slightly soft.
That is an asset-resolution limit, not a bug; regenerating at 2048 would fix it.

## The accent fix, and the second duotone

The plate's overlays hardcoded `#3b76ff`, `#9bc0ff`, `#1466ff` and `#0a235c`. That
broke two things at once. It contravened the contract stated at the top of the
`data-service` section of `app/globals.css`, which says every component inside a
service page reads only tokens and "never a hard-coded blue". And the blue it
invented matched no token in the system at all: measured, `--brand-tint` base is
`#51a2ff` and `--brand-blue` base is `#003a8e`, neither of them `#3b76ff`. The
visible result was an illustration rendering blue on the Power BI yellow page.

Fixed with two tokens. Their base values are the literal hexes, which is what keeps
`/sobre-nosotros` unchanged, and one general rule remaps them from the accent:

```css
[data-service] {
	--illustration-tint: var(--brand-tint);
	--illustration-veil: color-mix(in oklab, var(--brand-tint) 48%, white);
}

.dark [data-service] {
	--illustration-veil: color-mix(in oklab, var(--brand-tint) 49%, black);
}
```

The 48% and 49% are derived, not guessed. In OKLab, mixing the base tint with white
at 48% reproduces the base veil `#9bc0ff` and mixing it with black at 49% reproduces
`#0a235c`. Verified numerically: the light veil lands at `#9fc1ff` against `#9bc0ff`,
a delta of 4/255, and the dark veil at `#032260` against `#0a235c`, a delta of 7/255.
Layer 1, which carries the hue at 90% opacity, is byte-identical because the token's
base value *is* the same hex. Layer 2 is applied at 30-45% with multiply, so the
effective shift is one or two units. The timeline does not visibly move.

This needed no per-service block and no test change. `lib/service-accent.test.ts`
asserts that six named tokens are *present* in each override, not that no others
exist, and `lib/service-accent-map.test.ts` iterates only over the fields of
`SERVICE_ACCENTS`. The general `[data-service]` rule leaves both untouched.

The toolchain added a progressive-enhancement fallback on its own:
`[data-service]{--illustration-veil:var(--brand-tint)}` inside an
`@supports (color:color-mix(...))` guard. Only browsers older than 2023 reach it.

**Second duotone, and it is dead.** `components/duotone.tsx` holds a parallel
implementation with the same hardcoded blues. `DUOTONE_CONTAINER` is live, because
the plate imports it. But `DuotoneOverlay` and `DUOTONE_BASE` are reached only from
`components/coverage-grid.tsx`, which has **zero consumers**. So the contract is
still violated in that file, with no user-facing effect. Worth knowing: the two
implementations had diverged. `DuotoneOverlay` uses `opacity-25` on the white layer
where the plate uses `opacity-15`, and it carries an extra blue screen layer in dark
mode that the plate does not. They were two versions of one effect and nobody
noticed, because one of them stopped being rendered.

## The optimizer cache trap

Replacing an image **at its existing path** does not invalidate Next's image
optimizer cache. It keys on URL, width and quality, so the same path with new bytes
keeps serving the old ones. Measured 2026-09-21 after regenerating
`public/img/problemas/reportabilidad.png` from landscape to portrait at the same
path, with 44 files already cached:

| Width | With the stale cache | After purging `.next/cache/images` |
| --- | --- | --- |
| 1080 | 49.4 KB | 78.3 KB |
| 1200 | 55.0 KB | 78.3 KB |
| 1920 | 60.9 KB | 78.3 KB |

The 49.4 KB figure is the landscape asset's number from an earlier measurement.
So the served bytes were the previous illustration, and it would have rendered in
the new portrait frame, which looks like a layout bug and is not one.

The thing to do before judging any replaced asset locally: `rm -rf .next`, or at
minimum `rm -rf .next/cache/images`. This matters more than usual in this project,
because replacing assets at their existing paths is now the established pattern:
the four story illustrations were swapped the same way. That swap escaped the trap
only by luck, since the old files were measured through a temporary copy under a
different path precisely to keep the comparison fair.

Two smaller findings from the same measurements. `w=1024` returns a 44-byte error,
because Next only serves widths from its configured list and 1024 is in neither
`deviceSizes` nor `imageSizes`; the `srcset` only offers valid widths so nothing
breaks. And the vertical asset's real cost is 53 KB at 640 and 78 KB at 1080 and
above, capped there because the source is 1024 wide and Next never upscales.

## Native review gate — unresolved

The implementation is complete and verified, but the native review **did not
produce a verdict**. As of 2026-09-21 the code in this candidate has not been
reviewed, and that gate is still open. Do not read the checks below as a review.

What worked. The preflight was resolved and the lineage was created on the final
candidate, one component plus four assets plus this document:

- lineage `review-5b2b1efbbd8a3b90`, state `reviewing`, generation 1,
  authority revision `sha256:382ebf3ddf0b27c7647fa174deb273770b72eb6313c91889a545a250cbefba4a`
- tier `medium`, 454 changed lines, correction budget 200
- one lens required, not four: `review-reliability`
- candidate frozen with a changed-path manifest, six paths

The intended-untracked selection was resolved through `inspect` with
`untrackedScope: "select"`. Passing the `selectionBinding` to
`select-intended-untracked` was rejected first with
`intended-untracked-selection-binding-rejected` and `mutation_outcome: none`, so
nothing was left in a partial state; the `inspect` route is the one that worked.

The blocker. Two host-relay attempts on the single materialize slot both failed
identically, about 55 and 59 seconds in:

```
outcome: pi-host-relay-transport-failure
failure: kind=pi-failed, stage=pi, exit_code=null, timed_out=false
reason:  Reviewer completion failed for review-reliability:
         Expected property name or '}' in JSON at position 1 (line 1 column 2)
mutation_performed: false
```

The reviewer model emits something that is not valid JSON from its second
character on, so the completion can never be admitted. `mutation_performed: false`
both times. A third STATUS read after the second failure returned a byte-identical
authority revision, the same generation, the same state and the same reoffered
slot, which proves the two failures mutated nothing.

Two identical failures after a successful forecast-and-acknowledge cycle is a
reproducible provider-side defect, not a transient blip, so the loop was stopped
deliberately rather than retried a third time.

What did **not** happen, and must not be inferred: no reviewer verdict, no lens
result, no acknowledgement, no burn, no closure, and no delivery gate satisfied.
The slot stays open and reoffers, so the lineage is intact and resumable.

Continuations, none of them taken yet:

1. Disable the review switch for this clone (`gentle-ai review mode disable
   --scope clone`, the `D` continuation) and let ordinary repository policy decide
   delivery. This is the human's decision and it bypasses the gate rather than
   satisfying it.
2. Retry the slot later, from a fresh STATUS, if the provider side is fixed.
3. Maintainer inspection of the authority and lineage.

## Evidence

- Audit findings: Engram observation `landing-2/svg-illustration-layer-evaluation`.
- Register diagnosis: `landing-2/svg-illustration-prompt-register`.
- Tool verdict: `landing-2/quiverai-verdict`.
