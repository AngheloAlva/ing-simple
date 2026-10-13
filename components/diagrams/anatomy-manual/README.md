# Manual processing and rework

An Anatomy pilot for **Procesos manuales** in the home's **El desafío** section. Only its visual is replaced; the title, body, card dimensions and other three visuals stay unchanged. The original `DiagramManualSteps` is retained for rollback.

## Read the story

1. A worker copies an illustrative order for **12 units** as **21**.
2. The document moves from **Cargar** to **Revisar**. The mismatch is marked; nothing is sent.
3. The document returns to loading. The pencil corrects the copy to **12**, then it goes through review again.
4. Only the corrected order reaches **Enviar**. Another blank order arrives at loading, ready to repeat the same manual work.

The person stays present throughout. This is repeated effort and correction, not the missing-person problem of the knowledge desk. The quantities and counts describe this example, not measured processing times or promised savings. `scene.json` defines the source/copy values and station coordinates; `model.ts` drives the document, pencil, visible field, phase captions and counters.

## Interaction

- The figure rests at the beginning until the card is hovered, keyboard-focused or tapped.
- First activation starts one complete 8.2-second story. Leaving the card or moving focus away does not cancel it, matching both other Anatomy pilots.
- It pauses offscreen or in a hidden tab, resumes on return and holds the final result. There is no idle loop or extra control panel. Reload to replay.
- Reduced motion shows the static final result. The accessible SVG description explains the error, correction and repetition without requiring motion.

## Construction and verification

60 prism solids: structural desk and chair, seated worker, upright source clipboard with supports and clip, loading/review pads, dispatch tray/nameplate, two folders and a three-part pencil. The pencil is the accent; the worker remains in neutral tones. SVG is pregenerated into `art.json` (approximately 130 KB), not built in the browser. Styles are isolated to `.manual-desk`; no runtime geometry, new dependency, pipes, turned bodies or WebGL is needed.

```sh
node scripts/anatomy/build-manual-desk.mjs --help
node scripts/anatomy/build-manual-desk.mjs
node scripts/anatomy/build-manual-desk.mjs --check
pnpm exec vitest run components/diagrams/anatomy-manual/model.test.ts components/challenge.test.tsx
```

Inspect the empty form, mismatched field, correction and final queue at desktop and 390px mobile in both themes. Verify hover-leave continuation, focus, offscreen pause, reduced motion and the absence of horizontal overflow. At 4× inspect the clipboard support, field text, pencil contact and tray/document occlusion; run the Anatomy line check on resting phases.

Rollback: restore `DiagramManualSteps` in `components/challenge.tsx`. No changes to `ChallengeCard`, the shared interaction context or the other visual modules are necessary.
