# Automation station pilot

A 50-part isometric document sorter illustrates two outcomes: complete requests are registered; requests with missing data wait for manual review. It is a simulation, not a promise of throughput or a live customer dashboard.

## Status: saved, not displayed

The home and service page use the original `AutomationFlow`, which explains the service more clearly. This pilot is preserved for future exploration, not mounted on any public route. Its two destinations still need a stronger visual distinction beyond position before reconsidering placement.

When mounted for a future preview, **Datos completos** and **Faltan datos** select the scenario. Pause/resume and restart controls support keyboard and touch. Reduced motion shows the selected outcome immediately, without autoplay.

The tour pauses when offscreen or in a hidden tab. Hover or keyboard focus holds the completed request rather than starting another cycle. The visual readout follows the current pose; the accessible description changes only when the visitor selects a scenario.

## Change the figure

- `model.ts`: one source for the card's position and phase; seconds are illustrative animation timing.
- `automation-station.tsx`: accessible controls and a single ref-driven animation loop.
- `station.css`: isolated styles using the site's light/dark and service tokens.
- `art.json`: generated SVG layers and projection vectors; do not edit manually.
- `scripts/anatomy/build-automation.mjs`: parts, dimensions and painter's order.
- `scripts/anatomy/vendor/iso-kit.mjs`: the supplied Anatomy skill's geometry kit, copied unchanged. Build-time only; never imported by the application.

Regenerate geometry and verify it is current:

```sh
node scripts/anatomy/build-automation.mjs
node scripts/anatomy/build-automation.mjs --check
pnpm exec vitest run components/diagrams/anatomy-automation
```

This pilot uses rectangular solids, inset outlines and screw dots, with no cables, pipes, turned bodies or WebGL. Its card passes through the open gantry and enters either tray through the central gap. Check both destinations and the under-reader pose when changing dimensions or layer order.

## Integration

The automation entry in `components/service-diagrams.tsx` maps to `AutomationFlow` from `components/diagrams/flow/automation-flow.tsx`. Keep it that way unless a new placement is approved. The Anatomy implementation, generator and tests remain available without replacing the original visual or changing the other services.
