# Scattered-data cabinet

Compact Anatomy figure for the home challenge card **Datos dispersos**. The original
`components/diagrams/challenge/scattered-data.tsx` remains available for rollback.

## Meaning

Three independent filing cabinets hold different facts about the **same example
order**: a spreadsheet contains 12 requested units, a separate system shows 8 in
stock, and email contains the payment confirmation. Each drawer opens in turn and
exposes its own record. The common report retains three unknown fields.

The information exists, but there is no shared view to decide from: someone must
cross-check the sources. This is not an incorrect-data story, an access lock, or an
automatic integration demo. Quantities are illustrative, not real business data
or measured savings.

## Story and interaction

- Initially all three drawers are closed. There is no visibility-triggered autoplay.
- First hover, keyboard focus, or mobile tap starts the full 6.4-second story.
  Leaving the card does not cancel or reset it.
- Planilla opens first (0.35–1.25s), Sistema next (2.15–3.05s), Correo last
  (3.95–4.85s). The legend reveals a fact only when its drawer is fully open.
- At 5.6s the caption explains the consequence. All drawers remain open; the
  common report stays incomplete. Final pose persists until reload.
- Offscreen/hidden pages pause the clock. Reduced motion renders the final pose.
- Existing card frame, title, copy and keyboard target remain unchanged.

## Build-time geometry

`scene.json` owns source labels, illustrative values, positions, drawer travel and
arrival milestones. `model.ts` drives drawer motion, fact visibility, captions and
counts. `scattered-cabinet.tsx` updates SVG refs without per-frame React renders.

The builder uses the existing vendored iso-kit; no geometry library ships at
runtime. Its 68 solids comprise:

- Three cabinets, 21 solids each: four feet, plinth, back, two side walls, lid,
  two guide rails, drawer bottom/back/sides/front, two handle mounts, grip,
  record and tab.
- Five report parts: clipboard, sheet, two clip feet and clip bar. Three ruled
  unknown fields and face fasteners are surface details, not extra solids.

For each cabinet, back/carcass layers paint first, followed by the translated
drawer and record, then its front lip/handle and the fixed right casing/lid.
The SVG field values use the same source records as the HTML legend. Isolated
`.scattered-cabinet` styling follows the site's light/dark tokens.

```sh
node scripts/anatomy/build-scattered-cabinet.mjs
node scripts/anatomy/build-scattered-cabinet.mjs --check
node scripts/anatomy/build-scattered-cabinet.mjs --help
pnpm exec vitest run components/diagrams/anatomy-scattered/model.test.ts components/challenge.test.tsx
```

`--check` verifies the saved artifact without writing. `--help` displays usage
without changing it. After geometry edits, regenerate `art.json`; inspect initial,
partially opened and final states at 4× in both themes, including the drawer lips,
records, handles and report. Run Anatomy line checks on the same states. The
horizontal report label is anchored below the board's projected lowest corner;
verify at least 2 CSS pixels between their browser bounding boxes at desktop
and 390px widths (a world-space Y offset alone is insufficient).

## Rollback

In `components/challenge.tsx`, replace the `DiagramScatteredCabinet` import and
render with `DiagramScatteredData` from `components/diagrams/challenge/scattered-data`.
The other three Anatomy cards and shared activation context are unchanged.
