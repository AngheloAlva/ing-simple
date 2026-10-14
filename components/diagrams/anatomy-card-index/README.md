# Card index

Anatomy figure for the guide `ley-21719-que-hacer-antes-del-1-de-diciembre`,
registered as `ley-fichero-de-licitud` in `components/guias/diagramas.tsx`. It
sits after the "cuatro cosas" paragraph in "Lo que hay que saber", next to the
existing `ley-linea-de-tiempo` and `ley-inventario` diagrams, which stay.

## Meaning

The rule it teaches: every processing activity needs a legal basis; if the only
answer is "porque sí", it must be justified or removed.

- A card index drawer ("Tratamientos") holds one card per activity.
- Cards rise one at a time and get a tab with their basis. The bases match the
  `ley-inventario` table: Responder cotizaciones → Interés legítimo, Facturar y
  despachar → Contrato, Pagar sueldos → Obligación legal; plus Enviar el
  newsletter → Consentimiento.
- "Contactos en el WhatsApp" rises, gets no tab, and moves to an upright stand
  labelled "Justificar o eliminar". That card, once out, is the single accent.
- Readout at the end: "5 tratamientos · 4 con base · 1 por justificar".

Illustrative examples; the guide's "no reemplaza una asesoría legal" note applies.

## Story and interaction

- The 9 s story starts the first time 45% of the figure is on screen, holds the
  final pose for 3 s (`loopPause` in `scene.json`) and starts over; `loopTime`
  maps the running clock to story time. Offscreen or hidden pages pause the
  loop. Reduced motion renders the final pose and never loops.
- Each card: rise 0.4 s, tab at 0.5 s, back down 0.9–1.3 s. The card without a
  basis moves sideways over the right wall, then down into the stand.
- An HTML list under the drawing repeats each card and its live status, so the
  figure reads at 390 px where the engraved card text is too small.

## Build-time geometry

`scene.json` owns the cards, bases, tab positions and timings. The builder paints
cards back to front with the drawer rod in segments between them; the card that
leaves is rendered twice (in its slot and in the stand) and the page switches
between them with the model's `front` flag.

```sh
node scripts/anatomy/build-card-index.mjs
node scripts/anatomy/build-card-index.mjs --check
pnpm exec vitest run components/diagrams/anatomy-card-index components/guias/diagramas.test.tsx
```
