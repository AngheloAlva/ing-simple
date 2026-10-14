# Invoice gate

Anatomy figure for the guide `ia-en-procesos-por-donde-empezar`, registered as
`ia-umbral-de-confianza` in `components/guias/diagramas.tsx`. It sits right
after the paragraph that explains `confianza` and `revisar`; the JSON example
and the `ia-que-proceso` and `ia-paso-que-cambia` diagrams stay.

## Meaning

The rule it shows: when the confidence of a reading falls below a threshold you
define, the case is routed to a person instead of going on to the system.

- Six invoices slide from a hopper onto rails under a reader.
- A dial gauge on the back panel shows each reading's confidence; the threshold
  (0,85) and the zone above it are the figure's single accent (`--primary`).
- A diverter block sets the lane: confident invoices land in "Sistema"; the
  blurred scan (0,62) lands in "Revisión", next to a loupe.
- The first invoice is the guide's JSON example: Suministros del Sur SpA, 0,93.
- Readout at the end: "6 facturas · 5 al sistema · 1 a revisión".

Invoices and confidences are illustrative.

## Story and interaction

- One invoice every 1.3 s from 0.4 s: feed 0.4 s, read until 0.8 s (the needle
  rises to the confidence), diverter until 0.95 s, slide into the tray until 1.3 s.
- Starts the first time 45% of the figure is on screen, holds the final pose for
  3 s and starts over; pauses offscreen. Reduced motion shows the final pose.

## Build-time geometry

`scene.json` owns the threshold, invoices and timing; `model.ts` derives the
lane, needle, diverter, counts and captions. The dial, needle, diverter offset
and moving invoice are drawn by `invoice-gate.tsx` in the figure's projection;
dial coordinates are rounded so server and client render identical attributes.

```sh
node scripts/anatomy/build-invoice-gate.mjs
node scripts/anatomy/build-invoice-gate.mjs --check
pnpm exec vitest run components/diagrams/anatomy-invoice-gate components/guias/diagramas.test.tsx
```
