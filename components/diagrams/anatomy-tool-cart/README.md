# Tool cart

Anatomy figure for the **Capacitaciones** service page, in the left column of
"El problema". It replaces `/img/problemas/capacitaciones.png`, which stays in
`lib/services.ts` as the rollback asset.

## Meaning

The section title is "Pagas por herramientas potentes y usas una fracción". The
home card "Conocimiento que no circula" already covers the single person who
knows; this scene shows the fraction:

- A rolling tool cart holds one drawer per paid tool: Power Apps, Power BI and
  Excel. Three licence cards stand on the worktop.
- Each drawer has six tools in a foam insert. Tools in use are worn, untagged and
  carry the figure's single accent (`--primary`); the rest still have their shop
  tag. Power Apps 0 of 6, Power BI 1 of 6, Excel 1 of 6.
- Readout at the end: "3 licencias pagadas · 2 de 18 herramientas en uso".

The tools stand in for features. Counts are illustrative, not a usage measurement.

## Story and interaction

- The 7 s story starts the first time 45% of the figure is on screen (there is
  no card hover on the service page), holds the final pose for 3 s (`loopPause` in `scene.json`) and starts over; reduced motion never loops.
- Drawers open one at a time, bottom to top: Power Apps 0.3–2.6 s, Power BI
  2.8–5.1 s, Excel from 5.3 s. Excel stays open in the final pose.
- Only one drawer is ever open: an open drawer physically covers the ones below
  it, so opening several at once would hide their contents.
- Offscreen or hidden pages pause the clock. Reduced motion renders the final pose.

## Build-time geometry

`scene.json` owns drawer names, tool counts, which tools are used and the
timings. `model.ts` derives drawer travel, statuses, counts and captions;
`tool-cart.tsx` writes transforms to SVG refs without per-frame React renders.

Drawers are short with thick foam so their contents stay visible above the
front panel at the 40° camera; a storage cabinet with a door fills the lower
half. Paint order: casters, carcass back and left side, cabinet door, drawers
bottom to top (each inner parts, then right wall and front), then the right
side, worktop, push handle and licence holder.

116 solids, built by `scripts/anatomy/build-tool-cart.mjs` with the vendored
iso-kit; nothing ships at runtime.

```sh
node scripts/anatomy/build-tool-cart.mjs
node scripts/anatomy/build-tool-cart.mjs --check
pnpm exec vitest run components/diagrams/anatomy-tool-cart components/servicios/problem.test.tsx
```

## Rollback

Remove the `capacitaciones` entry from `PROBLEM_VISUALS` in
`components/servicios/problem.tsx`; the section falls back to `problemImage`.
