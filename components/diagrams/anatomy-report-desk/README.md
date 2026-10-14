# Report desk

Anatomy figure for the **Reportabilidad** service page, in the left column of
"El problema". It replaces `/img/problemas/reportabilidad.png`, which stays in
`lib/services.ts` as the rollback asset.

## Meaning

The page copy says the monthly report is assembled by hand, every area keeps its
own version of the numbers, and the decision is already made when the report
arrives. The home card "Datos dispersos" already shows *where* the data lives, so
this scene shows *when* the report arrives:

- A stacked letter tray holds one sheet per area with a different total for the
  same figure: Ventas 124, Finanzas 118, Operaciones 131.
- The sheets are carried one by one into the "Informe mensual" binder while the
  desk calendar advances from day 1 to day 6.
- On day 2 a rubber stamp marks "Decidido · día 2 · sin informe" on a memo. The
  imprint is the figure's single accent (`--primary`, so it follows the service
  colour).

Totals and days are illustrative, not business data or measured delays.

## Story and interaction

- No hover target exists on the service page, so the 7.4 s story starts the
  first time 45% of the figure is on screen. It holds the final pose for 3 s (`loopPause` in `scene.json`) and starts over; reduced motion never loops.
- Ventas 0.4–1.6 s, stamp down at 2.0 s, Finanzas 2.8–4.0 s, Operaciones
  4.8–6.0 s; the final caption appears at 6.8 s.
- Offscreen or hidden pages pause the clock. Reduced motion renders the final pose.

## Build-time geometry

`scene.json` owns totals, timings, the rack and binder positions. `model.ts`
derives sheet offsets, the stamp height, the day, captions and counts, and
`report-desk.tsx` writes them to SVG refs without per-frame React renders.

Each carried sheet is rendered twice: inside its tier (between the resting sheets
and the tier lip) and in front of the rack. The model's `front` flag switches
visibility once the sheet has slid out of its tier, so it is never painted over
the tier above while inside, nor under it once outside.

The builder uses the vendored iso-kit; nothing ships at runtime. 65 solids: desk
(13), rack (4 posts and 7 per tier), three carried sheets, binder (3), calendar
(5), memo, stamp (4), ink pad (2) and pencil (2).

```sh
node scripts/anatomy/build-report-desk.mjs
node scripts/anatomy/build-report-desk.mjs --check
pnpm exec vitest run components/diagrams/anatomy-report-desk components/servicios/problem.test.tsx
```

## Rollback

Remove the `reportabilidad` entry from `PROBLEM_VISUALS` in
`components/servicios/problem.tsx`; the section falls back to `problemImage`.
