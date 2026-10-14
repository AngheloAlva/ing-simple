# Duplicator

Anatomy figure for the **Automatizaciones** service page, in the left column of
"El problema". It replaces `/img/problemas/automatizaciones.png`, which stays in
`lib/services.ts` as the rollback asset.

## Meaning

The section title is "Horas de tu equipo en trabajo que una máquina haría
mejor". The home card "Procesos manuales" already shows copying, an error and a
second review at a desk; this scene shows the repetition and its cost in hours:

- A hand-cranked duplicator on its stand: the machine exists, but still depends
  on a person turning the crank. The crank is the figure's single accent
  (`--primary`).
- Every turn takes one blank from the feed, prints the same document, adds one
  to the copy counter and fifteen minutes to the hour meter on the stand.
- Copies 5 and 10 come out smudged and fall into the reject bin.
- Readout at the end: "16 copias · 4 h de manivela · 2 con error".

Copies, minutes and errors are illustrative, not a measured workload. The
option first offered to the user said "40 copias · 5 h · 3 con error"; it was
reduced to 16 turns so each turn of the crank stays readable (40 turns in six
seconds is almost seven turns per second).

## Story and interaction

- The 7.4 s story starts the first time 45% of the figure is on screen (there is
  no card hover on the service page), plays once and never resets.
- Sixteen turns of 0.375 s from 0.4 s. Each sheet leaves the drum after 30% of
  its turn and lands on the output stack, or in the reject bin.
- Offscreen or hidden pages pause the clock. Reduced motion renders the final pose.

## Build-time geometry

`scene.json` owns the copy count, the errors and the timing. `model.ts` derives
the crank angle, copies made, good and rejected copies, the remaining feed, the
hours and the moving sheet's progress. `duplicator.tsx` draws the live parts
(crank arm and knob, moving sheet, hour-meter needle, counter digits) in the
figure's own projection from the axes `art.json` exports, and shows or hides
the blanks, copies and rejects.

58 solids, built by `scripts/anatomy/build-duplicator.mjs` with the vendored
iso-kit; nothing ships at runtime.

```sh
node scripts/anatomy/build-duplicator.mjs
node scripts/anatomy/build-duplicator.mjs --check
pnpm exec vitest run components/diagrams/anatomy-duplicator components/servicios/problem.test.tsx
```

## Rollback

Remove the `automatizaciones` entry from `PROBLEM_VISUALS` in
`components/servicios/problem.tsx`; the section falls back to `problemImage`.
