# Ink plates for "Cómo mostramos nuestro trabajo" (`/casos`)

## Goal

Give each of the three items in the confidentiality section on `/casos` its own
ink plate in the existing illustration register, and make the section's left
column sticky so the text accompanies the list as it grows.

## Context

The site carries two illustration families, both rendered through
`components/illustration-plate.tsx` (`DUOTONE_CONTAINER`, `LINE_ART_FILTER`,
`--illustration-tint` / `--illustration-veil`):

- `public/img/about/*.png` -> story timeline on `/sobre-nosotros` and the nav dropdown tile.
- `public/img/problemas/*.png` -> the "El problema" section of the four service pages.

Both live on one page template each. The third surface selected here is
`components/casos/confidentiality.tsx:35`: a section whose left column is the
Kicker "Cómo mostramos nuestro trabajo" + h2 + lede, and whose right column is
one bordered panel holding three items, each with a lucide icon in a bordered
square (`ShieldCheck`, `Layers`, `EyeOff`) and a title + description.

## Why this surface, against the earlier doctrine

`odd/tasks/svg-illustration-layer.md` records a placement rule: illustration is
the register of narrative and people, and "an illustration in the FAQ, on
`/contacto` or in the hero is a different surface and adds decoration". Read
strictly, a plate here would be decoration, because this section is not the story
timeline.

**The user overruled the strict reading, and the reason is worth recording.** The
rule assumed a plate would be a generic ornament on an unrelated surface. Here
each plate carries the content of one item that already exists, so it is not an
ornament: it is the item's own subject, drawn. The doctrine therefore gains a
second criterion instead of being broken:

> A plate adds system when it is part of a repeated pattern on the same surface,
> **or** when it carries the content of the element it sits in.

The FAQ, `/contacto` and the hero stay out, because in those the drawing would
carry nothing the section does not already say in text.

## Decisions

- **Three plates, one per item.** The user chose one per item over a single
  shared plate, and asked for **simple** compositions: fewer elements, no full
  room. Simplicity is the brief, not an accident.
- **The lucide icon square is replaced, not kept.** With a plate doing the item's
  visual work, keeping a 10x10 icon above it would be two visuals for one item.
  This is a proposal for the pilot; if the plate reads better as an addition, the
  icon returns and the finding is recorded here.
- **Base blue, not a service accent.** `/casos` carries no `data-service`, and
  this section is about the company's method rather than about one service, so
  the plate tokens keep their base values. No `data-service` is stamped here.
- **The plate is not the mockup register.** `detail-features` and the case
  mockups are diagrams with real names and results; these plates stay wordless.
  No plate is placed inside a mockup frame, and no mockup is placed inside a plate.
- **The folder is English.** The assets live in `public/img/cases/`, at the user's
  request, while `problemas/` and `guias/` stay in Spanish. That inconsistency is
  deliberate: the other two are referenced from data files with their own history,
  and renaming them buys nothing.
- **Sticky left column.** The user's own observation: with three plates the right
  column grows well past the text, so the left column is pinned with
  `lg:sticky lg:top-24` and the section is read as a pair instead of as a column
  floating above a long list.

## Assets

`public/img/cases/` (new directory, English name at the user's request), one per item:

| Item | Asset | Subject (device) |
| --- | --- | --- |
| Confidencialidad primero | `confidentiality.png` | A closed, sealed folder lying on a desk, with the rest of the desk covered; no padlock, because a lock is already the badge icon in the case cards. |
| Mockups fieles a lo real | `faithful-mockups.png` | A drafting sheet carrying a screen layout drawn in ink — wide header band, one headline line, two columns of dash rows — with a hand entering from the near edge, pen mid-stroke, completing the last row. |
| Sin datos sensibles | `no-sensitive-data.png` | A sheet whose ruled lines dissolve into empty blocks; the last blocks leave the sheet and hang past the near edge of the desk. No letters, no digits. |

The three devices are deliberately different from each other and from the two
shipped families: none is a person seated at a desk facing a screen. The second
has only a hand and a forearm as the human subject.

## Constraints

Carried from the shipped families except where the premise changed; the two
changes are marked and explained below.

- Fully transparent background. Non-negotiable: the plate composites the asset
  over a solid ground.
- Neutral ink: black contour plus at most two flat mid-grey tones. No colour of
  any kind; the duotone stack supplies the hue and the asset supplies the luminosity.
- Real tonal range: enough dark, mid and light mass. Near-white artwork collapses
  into a flat blue rectangle under the blend layers.
- Flat illustration, not a render: no gloss, no glow, no gradients, no plastic
  surfaces, no photorealism, no painterly texture.
- No text, letters, numbers or logos inside the artwork.
- No interface panels, no empty boxes, no grid of rounded rectangles.
- Cliché ban: no gears, no lightbulbs, no rockets, no handshakes, no targets with
  arrows, no magnifying glasses over puzzle pieces, no floating icons, no smiling
  figure facing the viewer.
- Canvas: **wide landscape at the plate's own 3:2**, and the composition **fills
  it** — the desk, the objects and the plant extend past all four canvas edges and
  are cropped by them. Empty transparency is allowed **between** objects, never as
  a band framing the drawing.

  Both halves of that depart from the shipped families, and both departures come
  from the same discovery: their rules were written for an asset that
  `object-cover` crops into a *different* frame. "Square or 4:3, never 16:9" existed
  because the `about` asset had to survive both a 16/9 story plate and a near-square
  nav tile. "At least 18% empty margin on all four sides" existed to keep the
  subject alive through that crop. A plate in this section renders in exactly one
  frame, at the asset's own ratio, so nothing is ever cropped: a square canvas
  letterboxes into a floating island, and a margin does nothing except push the
  drawing away from its own edges, where it reads as padding. See "The canvas was
  the wrong shape" and "The margin rule was the padding".
- Under ~250 KB per file after the generator's output is re-encoded. Not met by any
  asset of this family so far (the shipped one is 1,144 KB); see the served-weight
  note under Risks, which is the number that actually reaches a visitor.

## Non-goals

- Do not touch `components/case-study/*`. `/casos/[id]` is explicitly out of
  scope for this feature: 4 of the 9 case pages already carry a `MagicTransform`
  block in that section, and mixing registers there is a separate decision.
- Do not hide, rewrite or reorder the three items' copy. The plates accompany the
  existing content.
- Do not stamp `data-service` on the section.
- Do not remove the relief machinery from `/guias` here; that is the next feature.
- Do not illustrate the case grid, the stats panel or the hero.

## Tasks

- [x] Write the pilot brief from the section's own copy, reusing the validated
      style block verbatim.
- [x] Pilot generated and verified. **Three generations were needed**, each one
      falsifying a different carried-over rule: the ink treatment, the canvas shape,
      and the framing margin. All three are recorded below.
- [x] Write the remaining two briefs, with the treatment correction, the wide
      canvas and the fill rule.
- [x] Left column sticky (`lg:sticky lg:top-24`) and the plate given the full inner
      width of the panel, above the text. The first layout tried an inset 208px
      thumbnail and the user rejected it in one sentence.
- [x] Generate and integrate all three plates; the icon branch collapsed and
      `image` became required.
- [x] Verify the branch: `pnpm typecheck`, scoped lint, focused tests, every
      referenced `/img/cases/` path resolved on disk.
- [x] Commit as work units on this branch.
- [x] **The user's visual check of the three plates in both themes: approved**
      (2026-09-23), on the strength of "Se ve excelente". That closes the open
      question in "Family measurements": the plates read as duotone images rather
      than washed panels, so the desk grey does not need darkening and the treatment
      filters stay exactly as they are.
- [x] Measure the served weight of the three assets once the family closes. Done
      2026-09-24; see "Served weight, measured".

```
9881df4  feat(casos): give the section its three plates and drop the icon branch
34eb91b  docs(odd): drop the margin rule from the briefs and collapse them into one block
778e5ce  fix(casos): trim the plate asset to its content box
29e3700  docs(odd): record the third generation and why the margin rule is met in purpose
f16250c  fix(casos): regenerate the mockup plate in the wide 3:2 canvas
b5818ef  docs(odd): keep the plant leaf inside the canvas in all three briefs
29bd707  docs(odd): scope the aspect constraint and record the crop finding
18859ea  fix(casos): fill the plate with a 3:2 frame and cover fit
770adfe  fix(casos): stack the plate above the item text at full width
1c61d3c  docs(odd): open the casos confidentiality plate feature
a077f8c  feat(casos): give the mockup item its ink plate and pin the section text
```

## Briefs

Two parts, pasted together: the **shared block**, which is identical for all three
assets, and one **subject** paragraph per asset. The split is deliberate. The
previous version repeated the whole prompt three times, and that is how a stale
instruction survived in two of them while the document said the opposite: the
canvas block still asked for "at least 18% empty margin on all four sides" after
the margin rule had been rescoped as inapplicable. One copy, one place to fix.

The style block is the one that produced the approved families, verbatim.

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
empty border around the drawing. Transparent areas are allowed only between
objects, never as a band framing the whole subject.

Strictly avoid: any text, letters, numbers or logos; any user interface presented
as a grid of bordered panels or rounded rectangles; sliders, toolbars and window
chrome; soft or blurred shadows; gradients; glossy or reflective surfaces; 3D
renders; photorealism; gears, lightbulbs, rockets, handshakes, targets, magnifying
glasses, floating icons; a face or a figure facing the viewer; colour of any kind.
```

### 1. `confidentiality.png` — subject only

```
A closed folder lying flat on a desk seen in three-quarter perspective and tilted
toward the viewer. The folder is sealed across its width with a wide solid black
band, and a plain flat disc rests on that band as a seal. Nothing is written or
drawn on the disc or anywhere on the folder. Beside the folder, a small stack of
loose sheets lies face down, their blank backs up.

Escape gesture: the sheet at the bottom of the folder slips out and hangs past
the near edge of the desk, its visible corner already beyond the desk lip.

Depth: the near edge of the desk crosses the lower part of the frame. No person at
all — no figure, no hands, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, and a leaf
of a long-leaved plant reaching in from the top corner. The near edge of the desk
is a solid black band.
```

Add to the avoid list for this one: a padlock or a shield.

### 2. `faithful-mockups.png` — subject only

Superseded three times: the treatment was corrected on the second generation
("`a few` surfaces filled in flat pure black" produced a drawing half as dark as
the family), the canvas on the third (a square asset cannot fill a 3:2 plate), and
the framing on the fourth (a brief that asks for 18% margins around the subject
produces a drawing floating inside its own canvas, which reads as padding). The
shipped file is the third generation, trimmed programmatically to its content box.

```
A drafting sheet lying on a desk seen in three-quarter perspective and tilted
toward the viewer. On the sheet, a screen layout drawn in ink line work: one wide
header band across the top filled solid black, a single headline line under it,
and two columns of short dash rows as body text. The lower rows are still
unfinished. A single hand and forearm enter from the near lower edge of the frame
holding a pen, caught mid-stroke, completing the last dash row. The sleeve of the
forearm is a large solid black mass.

Escape gesture: the row the pen is drawing runs on past the right edge of its own
sheet and hangs over the near edge of the desk.

Depth: the near edge of the desk crosses the lower part of the frame and the sheet
overlaps it. Only a hand and forearm — no face, no head, no body, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, a small
stack of loose sheets whose near edges are solid black, and a leaf of a
long-leaved plant reaching in from the top corner.
```

### 3. `no-sensitive-data.png` — subject only

```
A single sheet of paper lying on a desk seen in three-quarter perspective and
tilted toward the viewer. Across the sheet, rows of short ink dashes stand for
written text. From the top of the sheet downward the rows change: the first rows
are full dashes, the middle rows are shorter dashes, and the last rows are small
empty outlined blocks the size of the words they replaced. Those blocks still sit
on the ruled rows — they are word-sized holes in the text, never panels, never a
card grid, never a bordered rectangle larger than a word.

Escape gesture: the last row of empty blocks runs past the right edge of the sheet
and hangs over the near edge of the desk.

Depth: the near edge of the desk crosses the lower part of the frame and the sheet
overlaps it. No person at all — no figure, no hands, no chair.

Prop kit: a matte flat mug with its coffee surface filled solid black, a black pen
resting flat on the desk as a solid black mass, and a leaf of a long-leaved plant
reaching in from the top corner. The near edge of the desk is a solid black band.
```

## Pilot verification — `faithful-mockups.png`

Generated by the user with OpenAI on 2026-09-23, 1254 x 1254, colour type 6.
Measured with a stdlib PNG decoder (`/tmp/pngcheck.py`, zlib + struct + manual
unfiltering, 2.3 s per image). Reference for comparison: the approved
`public/img/problemas/desarrollo-web.png`, **read as an image**, not quoted from
this document's prose.

| Gate | Measurement | Verdict |
| --- | --- | --- |
| Transparent background | 66.9% alpha 0; 1.6% antialiasing ramp | pass |
| Opaque ink | 31.0% of pixels at alpha >= 250 | pass |
| Neutral colour | max channel spread 19, and only **48 pixels** above spread 12 out of 500,518 ink pixels (0.01%) | pass in practice; not the 0 of the shipped four |
| Tonal range | dark 21.5% / mid 21.9% / light 56.6%; mean ink luminance 162.8 | **fail — see below** |
| Content margins (bbox alpha>64) | L 11.2% R 7.4% T 12.0% B 6.5% | acceptable: `object-contain` on a transparent asset makes these non-critical, and the low bottom margin is the desk's near edge crossing the frame by design |
| File weight | 857 KB | see the served-weight note under Risks |

**What landed, and it was the hard part.** The hand and forearm enter from the
near edge holding a black pen, caught mid-stroke. The sheet carries a screen
layout in the approved vocabulary — one wide header band, a single headline line,
two columns of dash rows — so it reads as a page, never as a grid of bordered
panels. The escape gesture works and is nameable: the row the pen is drawing runs
past the right edge of its own sheet and hangs over the desk. No face, no body,
no chair. No text, letters, numbers or logos. The prop kit is present (mug, stack
of loose sheets, one leaf entering the top corner).

**What deviates, and it is two things.**

1. **The drawing is roughly half as dark as the family.** Dark share 21.5% against
   40.9% for `desarrollo-web`, and mean ink luminance 162.8 against 100.9-121.4
   across the four shipped problem scenes. The family uses large flat black masses
   — clothing, hair, chair — as anchors; here the only black is the sleeve and the
   pen. This is the exact failure mode the constraints warn about: the duotone
   stack collapses near-white artwork into a flat blue rectangle, so a plate this
   light will read paler than every other plate on the site, under a 90% colour
   tint, a 30% multiply veil and a 15% white screen.
2. **The shading is soft, not flat.** The shadow under the mug, the shadow under
   the sheet and the gradient across the mug body are blurred and airbrushed. The
   approved family uses hard-edged flat tones — the mug there is flat white with a
   solid black coffee mass and a thin grey band, and every shadow is a solid shape
   with a crisp edge. The brief said "no gradients"; the image has them.

**Decision: regenerate the same composition with a tightened treatment brief.**
The device, the framing, the gesture and the constraints all landed, and a
composition is the expensive part to re-derive. Only the ink treatment changes, so
the brief adds three explicit requirements and repeats the subject verbatim:
large areas of solid flat pure black, all shading as flat hard-edged shapes, and
an explicit ban on soft, blurred or airbrushed shadows and on gradients of any
kind. The tonal target is stated numerically — roughly a third solid black, a
third mid-grey, a third open white — because "enough contrast" is not measurable
by the model and "40% solid black" is.

### Second generation — treatment corrected, accepted pending the browser

Regenerated by the user on 2026-09-23 with the tightened brief above, same
composition. Measured with the same decoder.

| Gate | v1 | v2 | Verdict |
| --- | --- | --- | --- |
| Transparent background | 66.9% alpha 0 | 53.3% alpha 0 | pass |
| Opaque ink | 31.0% at alpha >= 250 | 45.2% at alpha >= 250 | pass |
| Ink coverage of canvas | 31.8% | 45.8% | pass |
| Dark share | 21.5% | **32.3%** | improved |
| Mid share | 21.9% | 8.1% | see below |
| Light share | 56.6% | 59.6% | see below |
| Mean ink luminance | 162.8 | **149.0** | improved |
| Colour spread > 12 | 48 px | **1 px** | pass |
| Content margins (bbox alpha>64) | L 11.2 R 7.4 T 12.0 B 6.5 | L 11.2 R 11.2 T 13.8 B 9.5 | pass |
| File weight | 857 KB | 992 KB | see the served-weight note |

**The treatment correction landed, and it is visible.** The shading is now flat
with hard edges: the mug carries hard-edged grey shapes instead of an airbrushed
gradient, the shadows under the mug, the sheet and the paper stack are solid
shapes with crisp edges, and there is no soft or diffused shadow anywhere. The
large flat black masses are there: the header band and the headline line on the
sheet are solid black, the sleeve is a big black mass, the plant leaves are solid
black, the near edges of the paper stack are solid black, and the desk's near edge
is a thick black band crossing the frame. The escape gesture still reads: the row
the pen draws clearly leaves the sheet and continues over the desk.

**Two numbers to read carefully rather than as a pass/fail.**

1. **Dark share 32.3% is still below the family's 40.9-46.7%.** Part of that is
   compositional and not a treatment problem: the subject here is a white sheet of
   paper occupying the centre of the frame, whereas the family's scenes are filled
   by dark clothing, hair and upholstery. Inking the page itself would destroy the
   "being drawn" read, so the honest position is that this plate is legitimately
   lighter than the family by construction.
2. **The mid share collapsed from 21.9% to 8.1%, and that is the correction
   working.** A blurred shadow is a smooth ramp of intermediate values; a flat tone
   with a hard edge produces almost none. The drop is the quantitative signature of
   flat shading, not a loss of range.

**What remains unverified, and it is the check that decides.** The structural and
numerical gates cannot see the duotone stack. The plate is composited under a 90%
colour tint, a 30% multiply veil and a 15% white screen, and whether a plate this
light reads as a duotone image or washes out is only answerable by looking at it
in both themes in the browser. That check is the user's, and it is the gate on the
remaining two generations.

**Integration state, deliberately partial.** The accepted pilot is wired into the
second item of `components/casos/confidentiality.tsx` through `IllustrationPlate`,
with the icon branch left in place for the other two items. When their plates land
the branch collapses and `image` becomes required, exactly as `problem.tsx`'s
`hasImage` branch was collapsed after its family shipped.

### The canvas was the wrong shape, and I read past the measurement

Seen by the user in the browser on 2026-09-23, in the new full-width layout. Their
words: the illustration "queda mal porque está cortada en vez de haber generado
una con las proporciones correctas". They are right, and there are two causes.

**The structural one.** The plate is wide and the asset is square, so
`object-contain` fits the drawing into the centre and lets the duotone ground fill
the rest. The result is a square island floating in a wide blue field with a hard
vertical edge on each side.

**The visible one, and it is the one that reads as a crop.** The composition runs
off its own canvas: the lower-right plant leaf and the right end of the desk are
clipped by the asset's right edge, and the sleeve is clipped by its bottom edge.
At 208px as an inset thumbnail nobody noticed. At full width the letterbox becomes
the frame and those clipped edges become the subject's frame, so the drawing reads
as a bad crop of a wider scene.

**The measurement was there and I waved it through.** The content box at
alpha > 64 measured L 11.2% R 11.2% T 13.8% **B 9.5%** against an 18% requirement,
and my own verdict in the table above reads "acceptable: `object-contain` on a
transparent asset makes these non-critical". That sentence was the mistake: I
excused a violated constraint because the fit mode hid it, when the constraint
existed precisely to keep the subject off the edges. A margin is not cosmetic. It
is the only thing standing between a drawing and a crop.

**Fix, applied in two places.** The brief now asks for the canvas at the plate's
own 3:2, at least 18% empty margin on all four sides, and explicitly forbids any
element touching or running off the canvas edge. And the integration moved from the
component's default `object-contain` to `object-cover` on an `aspect-[3/2]` frame,
so a matching asset fills the plate exactly and a slightly-off one fills it with a
few percent of crop instead of a band of ground.

**Where the aspect constraint came from, for the record.** "Square or 4:3, never
16:9 or portrait" was written for the `about` family, whose asset had to survive
`object-cover` inside both a 16/9 story frame and the near-square nav tile, and was
inherited verbatim by the `problemas` family without re-deriving it. Neither reason
survives here: one frame, no nav tile. Re-deriving a constraint when its premise
changes is part of the job, and this is the second time in this project that a
carried-over rule cost a generation.

### Third generation — wide canvas, and the ratio now matches the frame

Regenerated by the user on 2026-09-23 at the corrected canvas.

| Gate | v2 (square) | v3 (3:2) |
| --- | --- | --- |
| Dimensions | 1254 x 1254 | **1536 x 1024**, exactly the frame's 3:2 |
| Transparent background | 53.3% alpha 0 | 57.5% alpha 0 |
| Opaque ink | 45.2% at alpha >= 250 | 41.1% at alpha >= 250 |
| Dark / mid / light | 32.3 / 8.1 / 59.6 | 33.9 / 6.4 / 59.8 |
| Mean ink luminance | 149.0 | 149.1 |
| Colour spread > 12 | 1 px | 1 px |
| Margins (bbox alpha > 64) | L 11.2 R 11.2 T 13.8 B 9.5 | L 11.9 R 11.8 T 14.9 **B 5.8** |
| Weight | 992 KB | 1,376 KB |

**The ratio now matches the frame, so `object-cover` crops nothing, and that is
the entire point of the change.** The 18% margin rule exists to protect a subject
against a crop into a different aspect; with 1536 x 1024 in a 3:2 frame there is no
crop to protect against. The bottom margin of 5.8% is the desk's near edge and the
sleeve bleeding off the bottom edge, which is the same intentional escape the
shipped family already uses — `capacitaciones` runs 0.00% on the right and
`desarrollo-web` 0.07% at the top. Recorded plainly instead of reported as an 18%
pass, because it is not one: the constraint is satisfied in purpose and not in
letter, and the reason is verifiable rather than asserted.

**The register reads.** The desk runs corner to corner on the diagonal, the sheet
carries the layout in the approved vocabulary (solid black header band, one
headline line, two columns of dash rows), the hand holds a black pen mid-stroke,
and the row it draws leaves the sheet and continues across the desk to the right.
The flat treatment holds: hard-edged shadows under the mug and the stack, flat

greys on the desk with hatch marks, no gradient anywhere. The black masses are
substantial — two solid black leaves, the sleeve cuff, the desk's near edge, the
header band, the coffee surface.

**Still unverified, and still the decider.** Tonal numbers are unchanged from v2
(dark 33.9% against the family's 39.6-46.7%), so whether a plate at this lightness
reads as a duotone image or washes out is answered by looking at it in both themes
in the browser, not by the table. Served weight is also unmeasured: the source is
1,376 KB, and the family's measurement showed that line art on transparency is
WebP's worst case, which is why AVIF was enabled. Measure the served bytes when the
family closes, the way the `about` family did.

### The margin rule was the padding

Reported by the user after the browser check: "sigue viéndose con un padding...
puedes hacer que la imagen esté pegada a los bordes".

**The plate was already edge to edge.** The duotone ground reached the panel's
border on all four sides. What read as padding was the **drawing inset inside its
own PNG**: a transparent border measuring 11.9% left, 11.8% right, 14.9% top and
5.8% bottom at alpha > 64, with the drawing occupying only 76% of the canvas width.

**The cause was the brief, and it was mine.** It asked for "at least 18% empty
margin on all four sides", and the model produced exactly that. Worse: two sections
above the brief, this same document already said "the 18% margin rule exists to
protect a subject against a crop into a different aspect; with 1536 x 1024 in a 3:2
frame there is no crop to protect against". I identified the rule as inapplicable
and then left the number in the prompt the generator reads. That is the same
failure twice: a rule carried past its premise, and a document contradicting its own
brief.

It is the third generation this single carried-over rule has cost. The lesson is
not "be careful with margins". It is that a constraint has a premise, and when the
premise is gone the constraint has to be removed from the artifact the generator
reads, not merely noted as inapplicable somewhere else.

**Fixed in both places.**

1. The briefs no longer mention margins at all. The shared canvas block now asks
   for the composition to fill the canvas, with the desk, the objects and the plant
   extending past all four edges, and transparency allowed only between objects.
   The three prompts were also collapsed into one shared block plus one subject
   paragraph each, because the old version repeated the whole prompt three times
   and that is how a stale instruction survived in two of the three.
2. The shipped asset was **trimmed losslessly to its content box** with a stdlib PNG
   re-encoder (`/tmp/pngtrim.py`, zlib + struct + a hand-rolled chunk writer):
   1536 x 1024 -> 1176 x 814, the content box going from L 11.9 / R 11.8 / T 14.9 /
   B 5.8 to **0.00% on all four sides** at alpha > 0, with the ink pixel count
   identical (653,997) and the tonal distribution unchanged at dark 33.9 / mid 6.4 /
   light 59.8. Identical pixel statistics before and after are the evidence that the
   re-encode changed no pixel value, and the file also dropped from 1,376 KB to
   1,144 KB.

The trimmed asset's ratio is 1.445 against the frame's 1.5, so `object-cover` now
crops 1.85% off each side. That is the only crop in the pipeline and it is
under 2%. The frame stays 3:2 rather than following the trimmed box, because 3:2 is
the canvas the generator produces: future assets for this family arrive at exactly
3:2 and will fill it with no crop at all, and bending the frame to a trimmed asset's
incidental box would then crop *those* by 3.7%.

## Family measurements

All three assets, measured 2026-09-23 with the same stdlib decoder.

| Asset | Dimensions | alpha 0 | ink at alpha >= 250 | colour spread > 12 | Content box (alpha > 64) | KB |
| --- | --- | --- | --- | --- | --- | --- |
| `confidentiality` | 1536 x 1024 | 18.2% | 80.7% | 0 px | 0.00% all four sides | 1,595 |
| `faithful-mockups` | 1176 x 814 | 30.2% | 67.5% | 1 px | R 0.26% T 0.12% B 0.12%, soft fringe only | 1,144 |
| `no-sensitive-data` | 1536 x 1024 | 19.8% | 79.2% | 0 px | 0.00% all four sides | 1,510 |

All three are fully neutral, and all three reach **0.00% on every side at
`alpha > 0`**, so nothing floats inside its canvas. The two generated with the fill
rule hit 0.00% at `alpha > 64` as well. `faithful-mockups` does not, and the reason
is the trim: it was trimmed at `alpha > 4` to keep the antialiased edge intact, so a
soft fringe of pixels between 0 and 64 survives on the right, top and bottom — under
0.3% of the dimension, two to four pixels, invisible at any rendered size. Recorded
because the first version of this table said "0.00% all four sides" for it, which was
me reading the `alpha > 0` row of my own measurement output instead of the
`alpha > 64` row. The independent verifier caught it by re-running the decoder.

**The luminance histogram of the ink**, which is the measurement the duotone stack
actually receives, against three shipped assets as reference:

| Asset | black (< 64) | grey (64-191) | near-white (>= 192) |
| --- | --- | --- | --- |
| `confidentiality` | 27.6% | 34.6% | 37.8% |
| `no-sensitive-data` | 28.9% | 31.6% | 39.5% |
| `faithful-mockups` | 33.4% | 31.2% | 35.4% |
| `problemas/desarrollo-web` | 40.6% | 22.2% | 37.2% |
| `problemas/reportabilidad` | 44.7% | 27.4% | 27.8% |
| `about/power-bi` | 54.4% | 25.6% | 20.1% |

**This family is lighter than the shipped ones, and the cause is compositional, not
the treatment.** Solid black runs 27.6-33.4% here against 40.6-54.4% there, and the
missing black has a name: the person. Every shipped scene carries a large black mass
— clothing, hair, an office chair — and two of these three plates deliberately have
no person at all, so the largest object in frame is a desk painted in one flat
mid-grey. That grey is 29% of the ink sitting in the 160-191 band, and it is the
single reason the middle of the histogram is fuller here.

That deviation is the point of the family rather than a defect in it: the user asked
for a different subject, and removing the figure removes the dark mass with it.

**A measurement artifact I corrected against myself.** The earlier readings in this
document used dark/mid/light thresholds of 85 and 170, which put a genuine mid-grey
— the desk measures 184 — into the "light" bucket. That is why an earlier version of
these figures read "light 59.8%", alarming-looking and wrong. Broad bands at 64 and
192 are the honest split and are what the table above uses.

**The real risk that follows.** Under the plate's stack — a 90% colour tint, a 30%
multiply veil and a 15% white screen — ink concentrated in the grey and near-white
bands resolves to a pale blue-tinted panel, and this family has no black clothing to
hold the dark end down. Whether that reads as an image or washes out is not
answerable from the histogram. It is answered by looking at the three together, in
both themes, which is the user's check. If it does wash out, the lever is specific
and cheap: darken the desk's flat grey toward the mid band and let its near edge and
shadow carry more solid black, rather than touching the treatment filters.

## Served weight, measured

Measured 2026-09-24 against a production build of the site, requesting the optimizer
endpoint directly at four widths with `Accept: image/webp` and `Accept: image/avif`. The
three guide covers were measured in the same build so both illustration families went
through the same optimizer, side by side. Values in KB, webp / avif:

| Asset | 640 | 1080 | 1920 | 3840 |
| --- | --- | --- | --- | --- |
| `confidentiality.png` | 33.8 / 16.6 | 66.5 / 28.9 | 99.0 / 38.7 | 99.0 / 38.7 |
| `faithful-mockups.png` | 41.6 / 21.1 | 82.9 / 35.4 | 88.0 / 34.8 | 88.0 / 34.8 |
| `no-sensitive-data.png` | 38.5 / 19.8 | 73.2 / 32.5 | 106.3 / 42.6 | 106.3 / 42.6 |

**AVIF is 39-51% of WebP here**, a slightly wider gap than the guide covers because
these assets carry more ink coverage (79-81% of the canvas against 75-79%). At 1920 — the
size a DPR-2 request resolves to for the plate's ~648 CSS px column — the three cost
38.7 + 34.8 + 42.6 = **116 KB AVIF for the whole section**, and 293 KB if a client
somehow got WebP for all three.

**3840 costs exactly what 1920 costs**, because the sources are 1536 px wide and Next
never upscales: the served bytes are capped rather than doubled, so the plate cannot
grow past its source no matter what the browser asks for.

The retina caveat recorded earlier in this document is unchanged and now quantified:
the plate column reaches ~648 CSS px and a DPR-2 request wants ~1296, which the 1536 px
source covers. So unlike the cover, **the plates are adequately sampled**, and the soft
reading the earlier note worried about does not apply at this width.

The un-negotiated fallback remains PNG — 106 KB for a cover at 1080 against 37.2 KB as
AVIF — which is the floor for a crawler or an old client, and the reason AVIF is the
format that decides the real cost.

## Risks

- **The section's copy is abstract.** "Confidencialidad primero", "Mockups fieles
  a lo real" and "Sin datos sensibles" are statements about method, not narrative.
  The mitigation is that each plate draws a concrete, nameable object taken from
  the item's own sentence, and that a simple composition is accepted rather than a
  scene. If a plate reads as a generic icon at the size it renders, that is the
  failure mode to report, not to patch with more detail.
- **Two of the three subjects are paper.** The differentiation has to come from
  the device — closed and sealed, being drawn, dissolving — or the set will read
  as three variations of one drawing.
- **Weight.** Line art on transparency is the worst case for WebP; the family
  measurement from the shipped assets applies here too. AVIF is already enabled
  in `next.config.ts`, which is what keeps this weight-neutral.
- **Optimizer cache.** Replacing an asset at its existing path does not invalidate
  Next's image cache. `rm -rf .next` before judging any regenerated plate.

## Delivered shape

One component, three assets, one new directory, and nothing else moved.

```
M  components/casos/confidentiality.tsx
A  public/img/cases/confidentiality.png
A  public/img/cases/faithful-mockups.png
A  public/img/cases/no-sensitive-data.png
A  odd/tasks/casos-confidentiality-plates.md
```

`confidentiality.tsx` lost its `lucide-react` imports, its `icon` field and its
icon branch, gained `image`/`imageAlt` as required fields, and swapped a small icon
square per item for a full-width plate above the text. Its left column gained
`lg:sticky lg:top-24`.

Two invariants now hold by compiler rather than by convention: an item without a
plate fails to compile, because `image` is required, and the section cannot render a
half-illustrated state, because there is no branch left to render it through. That
is the same shape `problem.tsx` reached when its `hasImage` branch was collapsed.

## Evidence

- Audit of candidate surfaces: the scout report on the third illustration surface,
  which is what put this section on the list and ruled out `/casos/[id]`, the home
  and `/privacidad`.
- The three assets, with every gate measured: see "Family measurements" and the four
  subsections of "Pilot verification".
- Independent verification of the final branch, all passing: `pnpm typecheck` exit 0
  with no diagnostics, `eslint components/casos/confidentiality.tsx` at 0 errors and
  0 warnings, `vitest run` at 22 files / 200 tests against the baseline, the three
  referenced paths resolved on disk, and the whitespace check on the filenames that
  caught `no-sensitive-data.png` arriving with a leading space. It also re-ran the
  decoder and **refuted one number in this document**: the content box of
  `faithful-mockups` at `alpha > 64` is not 0.00% on all four sides, and the corrected
  figure is in "Family measurements".
- The commit list under Tasks, which is the work-unit trail for the whole feature.
- Method note for anyone re-measuring this family: `/tmp/pngcheck.py` (decode and
  gate), `/tmp/pnghist.py` (luminance bands), `/tmp/pngtrim.py` (lossless trim to the
  content box). All three are stdlib-only; there is no PIL, no numpy and no
  ImageMagick in this environment.
- Prettier and the `odd/tasks` folder: `pnpm exec prettier --check "odd/tasks/*.md"`
  flags this document, `dead-code-removal.md` and `svg-illustration-layer.md` alike,
  so the debt is the established norm for these state documents and was deliberately
  left alone rather than reformatting one file out of three.
