# Knowledge concentrated in one person

An Anatomy pilot for **Conocimiento que no circula** in the home's **El desafío** section. The title, body, card dimensions and other three visuals remain unchanged by this pilot. The original `DiagramSinglePoint` remains available for rollback.

## What it explains

A seated person resolves one request at a desk. The person then disappears, leaving the chair empty. New requests from **Ventas**, **Depósito** and **Administración** accumulate on the writing mat. Nobody takes over: **Trabajo pendiente · Sin alguien que pueda retomarlo**.

This is a dependency on someone's knowledge, not a broken machine, a locked account or a performance statistic. The four folders and counts are an illustrative example: one resolved before the absence, three waiting afterward. All positions, presence, outcomes, captions and counts come from `model.ts`.

## Interaction

- Hover or keyboard-focus the existing card; on mobile, tap it.
- The desk stays at the beginning until the card is hovered or focused. That first interaction starts one complete 6.8-second story, matching the fit-bench pilot.
- Leaving or blurring the card does not stop or reset the story. It holds its final state afterward, with no idle loop. Reload to replay.
- Offscreen and hidden-tab time pauses the animation. Returning resumes an already-started story, even without hover.
- Reduced motion shows the final blocked state immediately, with an empty chair and three pending folders.
- The SVG's accessible description explains the entire sequence without relying on animation.

## Construction and checks

65 prism solids: desk feet, legs, aprons, stretchers, top and writing mat; chair feet, legs, seat/cushion, back posts and backrest; seated figure; two document trays with rims/nameplates; pencil rest and pencils; four folders with covers, tabs and sheets. The body is stylized with rounded prisms, not turned bodies. There are no cables, pipes, WebGL layers or runtime geometry builders.

`build-knowledge-desk.mjs` reuses the vendored Anatomy kit and saves separate chair, person, desk, folder and stamp SVG layers in `art.json`. The client translates folders using the generated projection axes; styles are scoped to `.knowledge-desk` and do not alter the approved fit bench.

```sh
node scripts/anatomy/build-knowledge-desk.mjs --help
node scripts/anatomy/build-knowledge-desk.mjs
node scripts/anatomy/build-knowledge-desk.mjs --check
pnpm exec vitest run components/diagrams/anatomy-knowledge/model.test.ts components/challenge.test.tsx
```

Inspect the occupied desk, first completed request and empty-chair backlog in both themes, at desktop and 390px mobile. Check the person/desktop occlusion and stacked folders at 4×, run the Anatomy line check, and verify focus, offscreen pause and reduced motion. For rollback, replace `DiagramKnowledgeDesk` with `DiagramSinglePoint` in `components/challenge.tsx`; no shared card or context changes are needed.
