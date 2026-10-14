# Refresh press

Anatomy figure for the guide `por-que-el-informe-del-mes-se-arma-a-mano`,
registered as `reporte-una-definicion` in `components/guias/diagramas.tsx`. It
sits after the paragraph about the 06:00 refresh and before the checklist; the
`reporte-tres-capas` diagram, the definitions table and the DAX block stay.

## Meaning

The rule it shows: the formula lives in one place (the model), and at the
scheduled refresh every area receives the same number.

- A desk clock is wired to the press's control box. At 06:00 the box lights.
- The press lowers one die engraved "Ventas netas = facturado − notas de
  crédito" and stamps the Ventas, Finanzas and Operaciones sheets in one stroke.
- All three read 118: the stamped numbers (and the control light) are the accent.
- It resolves the Reportabilidad service scene, where the same three areas had
  124, 118 and 131, instead of repeating it.
- Readout at the end: "06:00 · 1 definición · 3 áreas, mismo número".

## Story and interaction

- Clock 05:00 → 06:00 from 0.4 to 3.0 s; light at 3.0 s; die down 3.3–3.8 s,
  stamp at 3.85 s, up 4.1–4.7 s.
- Starts the first time 45% of the figure is on screen, holds the final pose for
  3 s and starts over; pauses offscreen. Reduced motion shows the final pose.

```sh
node scripts/anatomy/build-refresh-press.mjs
node scripts/anatomy/build-refresh-press.mjs --check
pnpm exec vitest run components/diagrams/anatomy-refresh-press components/guias/diagramas.test.tsx
```
