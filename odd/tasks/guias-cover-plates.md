# Ink covers for the guides, and the removal of the pixel-relief effect

## Goal

Give each of the three existing guides a cover in the illustration register, and
delete the interactive pixel-relief cover effect it was trialled with — the
component, the assets, the two frontmatter fields that select it, and the tests
around all of it.

## Context

`/guias` is the fourth surface for the illustration register, and it is currently
the only one carrying a *third* visual language: a WebGL pixel-sculpture. The user's
words: "ahora hay una prueba que hicimos con imagenes y un efecto pixel pero lo
eliminaria y actualizaria las imagenes con el nuevo diseno que estamos viendo".

What exists today:

- `components/guias/cover.tsx` (38 lines) — the plain cover: an `<Image>` in an
  `aspect-video max-h-[60vh]` frame, with an optional credit chip. Its header comment
  states the old position explicitly: "No duotone: the photo carries the subject, the
  frame carries the brand."
- `components/guias/cover-relief.tsx` — the relief cover: a transparent still under
  `PixelSculpt`, cross-faded once the tile field has drawn, with a
  `ReliefBoundary` error boundary and a reduced-motion branch.
- `components/react-bits/pixel-sculpt.tsx` — the WebGL sculpture itself, whose only
  consumer in the repository is the relief cover.
- `components/guias/relief-boundary.tsx` and `components/guias/cover-relief-state.ts`,
  each with its own test file.
- `lib/guias/schema.ts` carries `portadaRelieve` and `portadaRelieveRecorte`;
  `lib/guias/fs.ts` asserts that the relief source exists on disk when the field is
  present.
- `app/guias/[slug]/page.tsx` branches on `portadaRelieve` to choose between the two
  covers.
- `components/guias/explorer.tsx` branches on the same field to decide the card's
  backdrop and `object-fit`.

**All three guides are `draft: true`**, and `includeDrafts()` in `lib/guias/fs.ts` is
false in production, so `/guias` renders only its empty state and
`/guias/[slug]` 404s in a production build. Everything here is visible in `pnpm dev`
only, until the guides are published. The user accepted that trade.

## Why the relief goes, and not just its assets

Two reasons, in order of weight.

The register argument: the site's rule is one visual language per element. The relief
is a third language — a raster photo sampled into a WebGL tile field — sitting exactly
where the illustration register now belongs. Keeping both would put two registers in
one element, which is the constraint the other three families were built around.

The cost argument, which is smaller but real: `pixel-sculpt.tsx` is 837 lines of
WebGL with a dynamic import, a device-capability boundary, a reduced-motion branch and
two supporting modules with two test files, all to animate one decorative image on a
route that no visitor can reach. If the covers become ink plates, all of it is dead
code the moment the last consumer goes.

## Scope

Two workstreams in one branch, in this order, because the first is independent of the
one open design question in the second.

**A. Remove the relief effect.** Delete the components and their assets, drop the two
schema fields, drop the existence assertion, collapse the two branches, update the
four test fixtures that carry the field, and update the two places that document it.

**B. Three ink covers.** One illustration per guide, rendered through
`IllustrationPlate` from `components/guias/cover.tsx`, which stops being a plain
`<Image>` and becomes another call site of the shared plate.

## The cover's frame — decided

The user chose **full-width 16:9 with the height cap removed**: `aspect-video` in the
existing `max-w-360` container, and `max-h-[60vh]` deleted. At a 1440 px viewport
that is 1360 x 765. The cover keeps its banner shape and its full-bleed feel, and it
gets 40% taller than today, which is the price the user accepted knowingly — the cap
existed to stop the cover from filling the first screen, and reverting it was a
deliberate decision rather than an oversight.

The rejected option was 3:2 with a `max-w-4xl` bound: 896 x 597, closer to today's
visual weight, but it turned the cover into a centred plate narrower than the article
column below it, which is a visible layout change the user did not want.

**The consequence the brief has to absorb.** The frame is 16:9 and the generator's
only landscape output is 1536 x 1024, which is 3:2. Something has to reconcile those,
and there are two candidates: leave the asset at 3:2 and let `object-cover` shave 11%
off the height, or keep the asset's ratio and change the frame — which the user just
declined. So the third path is taken, and it is the one that satisfies the rule with
nothing left to chance: **the asset is cropped to 16:9 before integration**, with the
same stdlib tooling the `/casos` family used, and the result is looked at rather than
assumed. 1536 x 1024 becomes 1536 x 864, a 160 px centre trim, and the brief asks for
the composition to sit inside the frame's vertical band so the trim has nothing
important to cut.

This is not the same mistake as the `/casos` margin rule. There, a margin was requested
for a crop that never happened, so the margin did nothing but shrink the drawing. Here
the drawing is trimmed by the same person who writes the brief, deterministically, and
the trim is verified by looking at the result.

This is the same class of problem the `/casos` plates hit, and it has to be settled
before the assets are generated, because the brief's canvas depends on it.

The cover box is `aspect-video max-h-[60vh]` inside a `max-w-360` container. At a
1440 x 900 viewport that resolves to 1360 x 540, a **2.52:1** strip, because the
height cap binds before the aspect does. The three existing cover files are all 16:9,
so the current covers are already cropped vertically by roughly 30% and nobody has
ever seen the top or the bottom of one.

A photograph survives that. A drawing does not, and the `/casos` work established the
rule: when the frame's ratio and the asset's ratio differ, the drawing is either
cropped or letterboxed into an island, and both read as a mistake. So either the cap
goes, or the box's ratio changes — and **the canvas can only be 3:2**, because that is
the only landscape the generator produces (1536 x 1024).

Two ways to pay for it, both cropping nothing:

| Option | Frame | Height at 1440 wide | What changes |
| --- | --- | --- | --- |
| **Full-width 16:9** | `aspect-video`, no `max-h` | 765 px | The cover keeps the full container width and the banner feel, and gets 40% taller than today. On a 900 px-tall viewport it fills the first screen almost entirely. |
| **3:2 with a width bound** | `aspect-[3/2]`, `mx-auto max-w-4xl` | 597 px | Closest to today's visual weight, no crop, but the cover becomes narrower than the article column below it, which is a visible layout change. |

A third option was considered and rejected: keep the cap and ask the brief for a
subject that survives a 2.52:1 centre crop. It fails for the reason the `/casos`
margin rule failed — it composes the drawing around a crop instead of removing the
crop, and in the shipped family the model complied with the letter of a margin rule
by shrinking the drawing until it floated.

**Recorded as decided by the user in the session that opened this feature.** Until it
is answered, workstream A proceeds and the covers are not generated.

## Constraints for the covers

Same shared block as the `/casos` family, with one difference: the fill rule is
horizontal only. The composition bleeds off the left and right edges and sits inside
the frame's vertical band, rather than bleeding on all four sides.

- Fully transparent background.
- Neutral ink: black contour plus at most two flat mid-grey tones, no colour.
- Flat, hard-edged shading; no soft or blurred shadows; no gradients; no gloss.
- Large areas of solid flat pure black, with the tonal target stated numerically:
  roughly a third solid black, a third flat mid-grey, a third open white.
- No text, letters, numbers or logos. The `portadaCredito` field exists for crediting
  a *photo* source; if the cover is an illustration, that field stays unused.
- No interface panels, no empty boxes, no grid of rounded rectangles.
- The cliché ban: no gears, lightbulbs, rockets, handshakes, targets, magnifying
  glasses, floating icons, no figure facing the viewer.
- Canvas: wide landscape at 3:2 for the generator, trimmed to the cover's final
  16:9 before integration, so the asset and the frame agree exactly.
- The composition sits inside the frame's vertical band: the desk bleeds off the left,
  right and bottom edges, and the brief keeps the essential content out of the top and
  bottom tenths so the 16:9 trim has nothing important to cut.

## Non-goals

- Do not publish the guides. They stay `draft: true`; flipping that flag is the user's
  decision and is not part of this feature.
- Do not touch the guide body, the MDX components, the diagrams or the TOC.
- Do not change `portada`'s required-ness or the `portadaAlt` requirement.
- Do not add a fourth cover component or a new kind of frame; the cover reuses
  `IllustrationPlate`, like the story timeline and the service problem section.
- Do not remove `illustration-plate.tsx`'s `object-contain` default. Call sites opt
  into `object-cover` explicitly, which is the established idiom.

## Removal map — workstream A

Deletions:

```
components/react-bits/pixel-sculpt.tsx            837 lines, sole consumer is cover-relief
components/guias/cover-relief.tsx
components/guias/relief-boundary.tsx
components/guias/relief-boundary.test.ts
components/guias/cover-relief-state.ts
components/guias/cover-relief-state.test.ts
public/img/guias/ia-en-procesos-por-donde-empezar-relieve.png
public/img/guias/ley-21719-que-hacer-antes-del-1-de-diciembre-relieve.jpg
```

Code and schema:

- `app/guias/[slug]/page.tsx` — drop the `GuiaCoverRelieve` import and the
  `portadaRelieve` ternary; render `GuiaCover` unconditionally, keeping the
  `portadaCredito` spread.
- `components/guias/explorer.tsx` — collapse `hasRelieve`: the card's backdrop becomes
  the plain `bg-muted/40` and its `object-fit` stops branching.
- `components/guias/cover.tsx` — rewrite the header comment, which currently states
  the opposite of the new position.
- `lib/guias/schema.ts` — remove `portadaRelieve`, `portadaRelieveRecorte` and their
  comments.
- `lib/guias/fs.ts` — remove the `portadaRelieve` existence assertion.
- `content/guias/README.md` — remove the two rows from the field table.
- `content/guias/_template.mdx` — remove the two commented fields and the paragraph in
  the writer instructions that explains them.
- `content/guias/ia-en-procesos-por-donde-empezar.mdx` — remove `portadaRelieve`.
- `content/guias/ley-21719-que-hacer-antes-del-1-de-diciembre.mdx` — remove both
  fields.

Test fixtures and assertions that carry the field and will not compile without it:

- `lib/guias/schema.test.ts` — five cases, lines ~107-137.
- `lib/guias/fs.test.ts` — three cases (~68, ~80, ~119) plus the frontmatter fixture
  at ~34.
- `lib/guias/filter.test.ts` — one fixture field.
- `lib/guias/index.test.ts` — one fixture field.
- `lib/seo/sitemap.test.ts` — one fixture field.
- `lib/seo/json-ld.test.ts` — one fixture field.

The four fixture fields are `portadaRelieveRecorte: true` on `GuiaMeta` objects: with
the schema field gone they become excess-property errors, so they are deletions and
not edits.

## Briefs

Two parts, pasted together: the **shared block**, identical for all three covers, and
one **subject** paragraph per guide. Same structure as the `/casos` family, and the
same reason for it: three copies of one prompt is how a stale instruction survives in
two of them.

Each subject is taken from its own guide's concrete vocabulary rather than from a
metaphor. That rule exists because of the mechanic's tool case: a brief that
translates "herramientas" into physical tools produces a perfect drawing of the wrong
world. So: the flow of steps comes from "anota cómo se hace hoy, paso por paso"; the
inventory rows come from "haz un inventario de los datos que tratas" and from the five
places the guide names where personal data lives; the report with its source sheets
comes from the monthly scene the guide opens with, where someone exports, copies,
pastes and prints.

### Shared block

```
Flat two-colour editorial illustration, hand-drawn ink style. Confident black
contour lines with a few surfaces filled in flat pure black, plus exactly two
flat mid-grey tones for shading. No other colours anywhere. No gradients, no
glow, no glossy or plastic surfaces, no 3D render, no photorealism, no painterly
texture. Isolated on a fully transparent background.

Ink treatment, and this is the part that matters most: large areas of solid flat
pure black, not small accents. Every shadow, every shaded surface and every
interior tone is a flat shape with a hard, crisp edge. No soft, blurred, diffused
or airbrushed shadows. No gradient on any surface. Nothing glossy or reflective.
Target roughly one third of the ink as solid black, one third as flat mid-grey,
one third open white.

Wide landscape canvas at 3:2, not a square, and fill it: the desk, the objects and
the plant extend past all four canvas edges and are cropped by them. There is no
empty border around the drawing. Keep the essential content inside the middle
vertical band of the canvas, so the composition still reads when the top and the
bottom are trimmed to a wider frame. Transparent areas are allowed only between
objects, never as a band framing the whole subject.

Strictly avoid: any text, letters, numbers or logos; any user interface presented
as a grid of bordered panels or rounded rectangles; sliders, toolbars and window
chrome; soft or blurred shadows; gradients; glossy or reflective surfaces; 3D
renders; photorealism; gears, lightbulbs, rockets, handshakes, targets, magnifying
glasses, floating icons; a face or a figure facing the viewer; a padlock; colour of
any kind.
```

### 1. `ia-en-procesos-por-donde-empezar.png` — subject only

```
A sheet of paper clipped to a small board with a plain clip, lying on a desk in
three-quarter perspective and tilted toward the viewer. On the sheet, a hand-drawn
process flow in ink: three or four steps in order, each drawn as a small hand-drawn
ink mark rather than a bordered box, joined by bold arrows that point from one step
to the next. The final arrow runs past the right edge of the sheet and continues
across the desk. Beside the board, a single loose sheet lies apart from everything,
blank and unconnected.

Depth: the near edge of the desk crosses the lower part of the frame. No person at
all — no figure, no hands, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, a stack of
loose sheets whose near edges are solid black, and a leaf of a long-leaved plant
reaching in from the top corner.
```

This one carries the guide's whole argument in one image: a process drawn step by
step, and one loose idea lying next to it, belonging to no process.

### 2. `ley-21719-que-hacer-antes-del-1-de-diciembre.png` — subject only

```
A single sheet of paper lying on a desk in three-quarter perspective and tilted
toward the viewer, ruled with evenly spaced horizontal rows drawn in ink. Each row
carries one small object, taken from the places the guide says personal data lives: a
folded letter, a small printed form, a phone lying flat, and a narrow card. The
objects sit on their rows like entries being written into an inventory. The topmost
object, the folded letter, has slipped off the sheet and hangs past the near edge of
the desk.

Depth: the near edge of the desk crosses the lower part of the frame. No person at
all — no figure, no hands, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, a stack of
loose sheets whose near edges are solid black, and a leaf of a long-leaved plant
reaching in from the top corner.
```

The device is the inventory, not the deadline. A date is unrepresentable — the
artwork ban forbids digits — and the guide's own first step is to write the inventory,
so that is what the cover shows.

### 3. `por-que-el-informe-del-mes-se-arma-a-mano.png` — subject only

```
A thick printed report lying on a desk in three-quarter perspective and tilted toward
the viewer. Its top page carries a large bar chart drawn by hand in ink, with
deliberately uneven hand-drawn columns. Under one side of the report, a fan of loose
source sheets is stacked, each carrying its own column of short dash rows. One of
those source sheets slides out sideways from under the report and hangs past the near
edge of the desk.

Depth: the near edge of the desk crosses the lower part of the frame. No person at
all — no figure, no hands, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, a black pen
resting flat on the desk as a solid black mass, and a leaf of a long-leaved plant
reaching in from the top corner.
```

One constraint learned from the `about` family applies here: the escape gesture must
involve a concrete, nameable object. "A sheet sliding out from under the report" is
concrete. Its rejected predecessor was "a long page unwinding over the desk", which is
not an object the model can draw, and it produced a vague ribbon.

## Tasks

- [x] Remove the relief effect: the eight deletions, the code and schema changes, the
      README and template updates, and the test fixture cleanup. Delivered in `e1bedaf`.
- [x] Settle the cover frame. **Full-width 16:9 with the height cap removed.** The
      canvas stays at 3:2 and the asset is trimmed to 16:9 before integration, since
      the generator has no 16:9 output.
- [x] Write the three cover briefs from each guide's own copy.
- [x] Generate the three covers and verify each one before integrating. Delivered in
      `45203ff`.
- [x] Trim each accepted cover to 16:9 and look at the result before integrating.
      Three images read, nothing lost, and all three read better in the wider frame.
- [x] Integrate. `cover.tsx` renders `IllustrationPlate` at `aspect-video` with
      `object-cover` and `priority` kept; the third guide's `portada` moved from `.jpg`
      to `.png`; all three `portadaAlt` values rewritten, and no `relieve` string is
      left anywhere in `app`, `components`, `lib`, `content` or `public`.
- [x] Verify: typecheck clean, scoped lint clean, 20 files / 183 tests, and every real
      `/img/guias/` reference in `content` resolved on disk. A production build would
      not have caught a missing cover, because all three guides are drafts and
      `getAllGuias` filters them out before `assertCoversExist` ever runs — the manual
      resolution check is the only one that can, which is why it is listed separately.
- [ ] **The user's visual check of the three covers in both themes, in `pnpm dev`.** The
      open gate, and the only one that can see whether a family at 23-28% black reads
      as an image or washes out.
- [ ] Measure the served weight of the three covers.

```
45203ff  feat(guias): give the three guides their ink covers
6a7d4fb  chore(gitignore): ignore the vitest json reporter output
f9527dc  docs(odd): open the guide covers feature and record the relief removal
e1bedaf  refactor(guias): remove the pixel-relief cover effect
```

## Workstream A delivered — `e1bedaf`

23 files, +12 / -1276. Verified by the writer and then read line by line by the parent,
specifically the parts that could hide a silent error: the collapsed ternary in
`app/guias/[slug]/page.tsx` with its `portadaCredito` spread intact, the collapsed
`hasRelieve` classes in `explorer.tsx`, and the two test files that were edited rather
than deleted, which still close correctly after one transient duplicate-brace mistake
the writer made and fixed inside the same run.

**Test accounting, because a count that drops quietly is the risk here.** 22 files and
200 tests before, 20 files and 183 after: 17 removed cases, all named.

| Where | Cases |
| --- | --- |
| `components/guias/relief-boundary.test.ts`, deleted file | 4 |
| `components/guias/cover-relief-state.test.ts`, deleted file | 4 |
| `lib/guias/schema.test.ts` | 6 |
| `lib/guias/fs.test.ts` | 3 |

The parent's instruction estimated five schema cases; there were six. The finding is
recorded rather than smoothed over, because an estimate that was wrong is exactly the
sort of thing that hides a real gap next time.

One finding the writer flagged rather than fixed, correctly, because the instruction
told it not to: the `portadaAlt` values of the IA guide and the Ley guide still read
"mostrada como un relieve de teselas", which stopped being true the moment the relief
was deleted. Those values are replaced in workstream B, where the covers themselves are
replaced.

The two orphaned relief assets went with it, 1.6 MB of source files whose only readers
were the fields that no longer exist.

## Workstream B delivered — `45203ff`

Three covers generated by the user, trimmed and integrated by the parent. 8 files,
+26 / -16 plus the binary replacements.

| Asset | Dimensions | alpha 0 | ink at alpha >= 250 | colour spread > 12 | Content box (alpha > 64) | KB |
| --- | --- | --- | --- | --- | --- | --- |
| `ia-en-procesos-por-donde-empezar` | 1536 x 864 | 23.8% | 75.2% | 0 px | 0.00% all four sides | 1,408 |
| `ley-21719-que-hacer-antes-del-1-de-diciembre` | 1536 x 864 | 22.8% | 76.3% | 0 px | 0.00% all four sides | 1,333 |
| `por-que-el-informe-del-mes-se-arma-a-mano` | 1536 x 864 | 19.9% | 79.1% | 5 px, max spread 17 | 0.00% all four sides | 1,522 |

**The trim, and a cost I did not expect.** Each asset arrived at 1536 x 1024, the
model's only landscape, and was trimmed to 16:9 at 1536 x 864 — 80 px off the top and
80 px off the bottom — with a stdlib re-encoder (`/tmp/pngcrop.py`). The three results
were read as images before anything was replaced, and all three read better in the
wider frame: the tighter crop removes empty desk and lifts the subject.

The cost is measurable. **The black share dropped two to three points across all
three**, measured at the same broad bands before and after: 29.1 -> 25.6, 26.6 -> 23.4,
29.4 -> 27.6. The cause is the top band — 80 px of it held the plant's leaves, which in
a person-free desk scene are one of the very few large solid black masses. So the
deterministic trim that removed an unwanted margin also took some of the family's dark
end with it. Nothing the composition needs was cut, and that was checked image by
image, but the covers now sit at 23.4-27.6% black: below the `/casos` family's
27.6-33.4%, and well below the 40.6-54.4% of the two older families. This is the
lightest family on the site, and whether that reads as light or as washed out is the
user's browser check rather than a number.

**The set, judged by looking.** The strongest is the IA cover: the escape gesture is an
arrow that leaves the clipped sheet and points at a single loose sheet lying apart from
everything, which is the guide's own argument in one image. The report cover's gesture
landed exactly as briefed, with a source sheet sliding out from under the printed
report and past the near edge of the desk. The Ley cover is the weakest of the three
and still good: the inventory device reads, but its escape — the envelope slipping off
the sheet — happens at the far edge, where an escaping object gets the least first-frame
scale. That is the same lesson the `capacitaciones` scene taught, and it is recorded
rather than fixed, because the drawing is comprehensible and the user may want to keep
it.

**One implementation note.** `IllustrationPlate` renders its own children-free frame and
takes no overlay children, so the credit chip moved out of the frame into a wrapper that
owns the radius and the clipping. No guide sets `portadaCredito` today, so the chip
renders for nobody, but the schema field stays and the wrapper keeps the capability
alive.

## Risks

- **The relief removal is a wide, shallow diff.** Sixteen files, most of them
  one-line fixture deletions. The review risk is that the test count drops and nobody
  notices which tests went with it; the mitigation is to report the before and after
  counts and name the deleted cases.
- **Deleting 837 lines of WebGL is irreversible in practice.** It is recoverable from
  git, and the user explicitly asked for the removal, so this is accepted rather than
  mitigated.
- **The cover is the guide's LCP element** and `cover.tsx` passes `priority` to the
  image today. `IllustrationPlate` accepts `priority` and forwards it, so the
  integration must keep it or the guide loses its LCP hint.
- **The 16:9 trim is a real crop of a drawing.** It removes 160 px of height from a
  1024 px canvas. The mitigation is that the trim is chosen by looking at the drawing
  rather than by arithmetic, and that the brief keeps the important content in the
  middle band; the residual risk is that a composition arrives with something
  essential in the top or bottom tenth, in which case the answer is a regeneration and
  not a smarter crop.
- **The frame decision changes a page template.** Both options are visible layout
  changes to every guide page, which is why it is the user's call and why the guides
  being drafts matters: the cost of getting it wrong is a dev-only view.

## Evidence

_(filled in as tasks land)_
