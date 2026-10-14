# Sorter

Anatomy figure for the **Desarrollo web** service page, in the left column of
"El problema". It replaces `/img/problemas/desarrollo-web.png`, which stays in
`lib/services.ts` as the rollback asset.

## Meaning

The section title is "La operación creció y las herramientas no acompañaron".
The home card "Herramientas que no encajan" already shows the generic system
that does not fit; this scene shows growth and the improvised patches:

- A twelve-cubby sorter on a work table was built for the operation as it was.
- Orders arrive week after week. Once the twelve cubbies are full, they spill
  into the patches the copy names: a shared clipboard ("Planilla", 6), an email
  tray ("Correo", 6) and a phone ("WhatsApp", 3). The last 3 pile up on top.
- The patches carry the figure's single accent (`--primary`).
- Readout at the end: "Capacidad 12 · 30 pedidos · 3 parches".

Orders and weeks are illustrative, not measured growth.

## Story and interaction

- The 7.2 s story starts the first time 45% of the figure is on screen (there is
  no card hover on the service page), plays once and never resets.
- One order every 0.2 s from 0.3 s. Cubby folders slide in from the front;
  everything else drops into place. A patch appears with its first order.
- Offscreen or hidden pages pause the clock. Reduced motion renders the final pose.

## Build-time geometry

`scene.json` owns destinations, counts and timing. `model.ts` derives the order
list, arrivals, drop progress, counts, captions and which patches are open.

The sorter's painter's order interleaves parts (shelf, wall, folder, wall…), so
the builder emits one `sequence` of static art, order items and patch parts that
`sorter.tsx` renders in order and drives through refs. The email tray is split
into two patch parts so its envelopes paint between the back and front walls.

94 solids, built by `scripts/anatomy/build-sorter.mjs` with the vendored iso-kit;
nothing ships at runtime.

```sh
node scripts/anatomy/build-sorter.mjs
node scripts/anatomy/build-sorter.mjs --check
pnpm exec vitest run components/diagrams/anatomy-sorter components/servicios/problem.test.tsx
```

## Rollback

Remove the `desarrollo-web` entry from `PROBLEM_VISUALS` in
`components/servicios/problem.tsx`; the section falls back to `problemImage`.
