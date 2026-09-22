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

**Correction owed.** The 6.4 MB argument was overstated. `next/image` re-encodes
to WebP/AVIF, so the 1.6 MB source files almost certainly were not served at that
weight, and page weight was already fine. The 6.4 MB is repository and optimizer
weight. The real case for replacing them is the palette mismatch and the blend
hack. Confirm the served weight during the pilot.

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
