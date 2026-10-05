# Web panel text legibility

## Goal
Show full sidebar label `Solicitudes de Levantamiento` and project value `Revestimiento de molino` in the Desarrollo web hero demo without redesigning the panel.

## Scope and constraints
Only components/panels/web.tsx targeted sidebar sub-item and desktop project-cell text wrapping, plus components/panels/web.test.tsx regression tests. Preserve Spanish strings/all request fields, compact cards, animation, existing sidebar/table vertical scrolling and unrelated hydration/entrance changes. No staging/commits authorized; branch feat/home-hero-clarity. RDD off. Delivery ask-on-risk; forecast30–90 authored diff lines advisory.

## Evidence
Explorer: sidebar fixed230px, sub-label truncate at web.tsx333–341; desktop project cell truncate514–516 in fixed16% column. Compact cards already break-words565, switch by760px container. Width-based cause inferred from source; browser must verify actual geometry.

## Tasks
- [x] W1 — Add focused full-text/nontruncation regressions, observe RED, minimally allow wrapping at the two render surfaces, observe GREEN and run focused tests/types/lint. Status: done (focused checks pass; commit not authorized). Route: gentle-ai-worker (source+test multi-file trigger).
- [x] W2 — Independent browser legibility and regression checks. Status: done (scoped candidate passes; separate baseline failures documented). Route: assess then gentle-ai-verify. Verify narrow cards and desktop table near760px container threshold plus roomy desktop, full targeted text visible where rendered, no new text overlap/card escape/page horizontal overflow, scroll remains usable. Full suite/types/targeted lint and focused spot check; scoped browser rendering checks not global audit.

## Acceptance
Both original strings visible in full, no ellipsis or clipping in their rendered surfaces. Wrapping does not collide with siblings or escape cards/cells. Table and compact-card data parity preserved; intentional vertical scroll unaffected. Prior uncommitted hydration/entrance fixes unchanged.

## Progress
Mapping complete; browser measurements pending. No source writes for this feature yet. Verification artifacts outside repository with explicit wrapper cwd. Two unrelated untracked marketing directories and retained ignored Playwright artifact out of scope.

## W1 evidence
Two new tests fail RED on truncate; existing2 pass. Minimal whitespace-normal/break-words replacement GREEN4 tests. Initial two optional capture access type errors fixed; final typecheck/targeted eslint pass. Vite native-config warning persists. ASSESS unassessable because untracked declaration required; RDDoff, independent verifier required. Browser visual proof pending, no staging/commits.

## W2 interim browser evidence
Scoped candidate passes target geometry: labels wrap2x18px, full character/line boxes contained with no clipping/overlaps.760px switch measured at viewport1113/1115 => container759/761 cards/table; all10 rows/8 fields parity. Independent commands focused4/full267 in32 files, types/lint pass. At320px page333px overflow pre-exists: footer Conversemos endpoint333.078 in91px column, email321.313; DOM A/B original truncate and restored wrapping all333px. Panel278/278 and cards244/244 no overflow. Normal-motion sidebar wheel moves page not nav in candidate/original/restored (nav0, max234 original252 candidate); reduce actual wheel works, both programmatic endpoints accessible; table/cards actual wheel works. These separate pre-existing failures are NOT fixed and not candidate regressions. Browser cleanup/hash check pending; do not claim all-page overflow or all-mode sidebar wheel passes.

## Final outcome
Scoped candidate PASS. Exact checks focused4/full267 in32 files, typecheck and targeted ESLint exit0. Chromium widths320/390/768/1024/1113/1115/1366/1440: full target text in cards one17.875px line or table2x18px, sidebar176x48px2x18px; contained through clipping ancestors after scrolling, no sibling overlap/card escape.10 records x8 fields parity. Table/cards wheel/endpoints pass; normal entrance/reduced static/no hydration/runtime errors. Pre-existing footer320px overflow and normal-motion sidebar wheel failure remain unchanged under original/candidate/restored DOM A/B, not scope expansion. Warning Vite config plus2 THREE.Clock notices/load. Production build/other browsers/global lint skipped. Artifacts /tmp/w2-web-legibility.D0Rz9Q/. Owned browser/server closed3100free, source/prior changes/next-env preserved. Concurrent task-document change attributed to parent, no verifier source writes. No staging/commits; user next decides commits or separately fixes baseline issues.

## Delivery authorization
User explicitly approved local commits after verified closeout. Commit code, tests and this evidence as one behavior work unit; push/PR/merge remain unauthorized. Earlier no-commit statements above describe the historical implementation phase.

## Rollback boundary
Revert this work unit's two wrapping-class substitutions and targeted web tests together; do not affect reduced-motion/hydration changes.
