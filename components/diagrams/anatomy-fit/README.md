# Generic-system mismatch pilot

Only **Herramientas que no encajan** in the home challenge section uses this Anatomy figure. The title, body, card layout and three sibling diagrams remain unchanged. The picture identifies the fixed mold as **Sistema genérico** and its three specimens as business processes, not anonymous shapes.

## Read the story

Run `pnpm dev`, open `/`, and hover or keyboard-focus the card in **El desafío**:

1. The opening starts empty; **Aprobaciones** waits in the rear loading pocket.
2. **Precios por cliente** (cross) approaches, touches the fixed rim and returns outside: **Trabajo manual**.
3. **Turnos** (bar) makes the same failed attempt while the opening is still empty.
4. **Aprobaciones** (square) fits. The final readout is **1 proceso dentro · 2 manuales**.

The 8.2-second example plays once per mount. Leaving the card does not rewind or hide a rejection; offscreen or hidden-tab time pauses it. There is no idle loop or added control panel. Reduced motion shows the final result immediately. The visible process legend and accessible SVG description explain the result even without watching the animation. Reload to replay.

The counters describe these three illustrative processes, not measured service performance. The original explanatory sentence is retained in the SVG description; visible stage text and a shape-keyed process legend replace the former caption.

## Geometry and checks

There are 51 solid parts: the original fixture, three specimens and a rear loading pocket. `scene.json` shares the process home positions, rim/floor heights and flight clearance between the model and builder. The aperture is 32 × 32 world units; the square is 28 × 28, the cross 42 × 42 and the bar 52 × 22. Incompatible pieces stop at the 28-unit rim, never descend into it, then return to their original trays. They travel above the clamps. Only the admitted square reaches the 8-unit cavity floor.

- `scripts/anatomy/build-fit-bench.mjs`: geometry and painter's order, using the existing vendored Anatomy kit.
- `art.json`: generated fixed and independently movable SVG layers; the builder never ships to the browser.
- `motion.ts`: one timeline for positions, collision captions, process outcomes and counters.
- `fit-bench.tsx`: a single ref-driven animation loop started by the existing hover/focus context.
- `fit-bench.css`: isolated light/dark shading and process-state styles.

```sh
node scripts/anatomy/build-fit-bench.mjs --help
node scripts/anatomy/build-fit-bench.mjs
node scripts/anatomy/build-fit-bench.mjs --check
pnpm exec vitest run components/challenge.test.tsx components/diagrams/anatomy-fit/motion.test.ts
```

Check desktop and 390px mobile in both themes, keyboard focus, offscreen pause and reduced motion. Inspect the empty opening, both rim contacts and the final state at 4×. The figure uses prisms and screw dots, not pipes, cables, turned bodies or WebGL.

## Rollback

In `components/challenge.tsx`, restore `DiagramGenericTool` from `components/diagrams/challenge/generic-tool.tsx`. The original visual is preserved. Do not change `ChallengeCard` or the other three diagrams. The service automation visual remains `AutomationFlow`; its separate Anatomy prototype stays archived.
