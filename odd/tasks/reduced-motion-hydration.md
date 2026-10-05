# Reduced-motion hydration consistency

## Goal
Fix the reported HowItWorks / CircuitTrace hydration mismatch while preserving normal animation and the reduced-motion static rendering.

## Scope and constraints
CircuitTrace and focused tests initially; confirmed remaining sibling attribute mismatches authorize the same minimal hook correction in HowItWorks with focused tests. No broader redesign. No hero/mobile/layout/copy changes. Preserve unrelated untracked marketing directories. Branch: feat/home-hero-clarity. No commits authorized by the user; commits pending explicit approval. RDD off. Forecast: 40–150 authored diff lines; delivery strategy ask-on-risk.

## Evidence
Read-only explorer identified direct motion/react useReducedMotion in components/circuit-trace.tsx driving conditional path/core markup. lib/motion.tsx already provides an app context backed by useSyncExternalStore with an explicit server snapshot. Confirmed browser mismatch under reduce on navigation and cache-disabled hard reload: HowItWorks > CircuitTrace > svg, expected junction circle versus server pulse path. SSR: 5 bed + 5 pulse paths, core opacity .25; reduced client: 5 bed, 0 pulses, static fill-opacity .35. No-preference navigation/reload have no hydration error and animation values change. Installed Motion source seeds state from null server versus matchMedia true client.

## Tasks
- [x] T1 — Reproduce mismatch in browser with reduced motion set before navigation; compare no-preference and hard reload. Status: done (browser reproduction confirmed; owned server and browser closed). Route: delegated gentle-ai-verify (verification trigger). No source edits.
- [x] T2 — Correct the confirmed cause and add deterministic focused tests. Status: done (focused checks passed; commit not authorized). Route: delegated gentle-ai-worker (source plus test multi-file trigger). Expected surfaces components/circuit-trace.tsx and components/circuit-trace.test.tsx. Observe RED then GREEN where meaningful; static render tests alone do not prove hydration correctness.
- [x] T2b — Correct HowItWorks sibling initial attributes via project preference hook, with conflicting-preference regression tests. Status: done (focused checks passed; commit not authorized). Route: delegated gentle-ai-worker (source plus test). Surfaces: components/how-it-works.tsx and components/how-it-works.test.tsx.
- [x] T3 — Verify hydration, preference behavior and regression checks. Status: done (independent commands/browser passed; limitations below). Route: native assess then required independent verifier; browser hydration checks mandatory. Focused tests, typecheck, targeted ESLint and applicable full tests. Record failures and skipped checks.

## Acceptance
No hydration mismatch under reduce or no-preference on fresh navigation and hard reload. Reduce renders static traces/cores, normal motion retains pulses. No broader animation redesign.

## Progress and next step
T1 complete; reduced navigation/reload fail and no-preference pass. Owned server/browser closed; no blockers. T2 completed: import switched to project context; two conflicting-preference tests. RED: normal 10 expected paths / 5 actual, reduce 5 expected / 10 actual. GREEN: 2 tests pass; typecheck and targeted ESLint pass. Vite configuration warning observed. Native ASSESS unassessable due to required explicit untracked declaration; RDD off, independent verifier required. T3 independent commands pass: focused 2 tests, full 261 tests/31 files, typecheck, targeted ESLint. Browser reduce navigation/reload still fail acceptance: HowItWorks sibling attributes differ (header translateY20px vs none; li translateY24px vs none; connector scaleX0 vs empty). Old CircuitTrace circle/path mismatch no longer observed. Verifier gathering final attribution and behavior before cleanup. Do not claim completion; narrow same-section correction and reverification pending. No staging/commits. Historical global lint failures are not a clean baseline claim for this candidate; verify exact failures if used.

### T3 first browser result
FAIL reduced navigation/reload at HowItWorks heading (:104), steps (:86,143), connectors (:155,169), attributable to unchanged direct Motion hook (:10,78). CircuitTrace passes static/animated behavior and preference changes in both directions; no old markup mismatch. Normal navigation/reload pass. No other console errors; Motion reduced-motion and THREE.Clock deprecation warnings observed. Chromium 1280px smoke: no horizontal overflow. Verifier owned browser/server closed; port3100 freed. Artifacts /tmp/reduced-motion-t3-independent/. T2b minimal import correction required before closing T3.

### T2b outcome
HowItWorks hook import switched to project context; 2 regression tests cover heading, four items, active connectors and final connector under conflicting preferences. RED both tests failed heading transforms; GREEN all 4 focused tests pass. Initial four TS2532 test-indexing errors fixed; final typecheck and targeted ESLint pass. Vite config warning persists. ASSESS again unassessable due untracked declaration, RDD off; separate final verification required. No staging/commits.

### T3 repeat interim evidence
Independent commands pass: focused 4 tests/2 files, full 263 tests/32 files, typecheck, targeted ESLint. First reduced Chromium navigation has 0 console/page errors and 0 hydration notices. CircuitTrace static 5 bed/0 pulses/5 cores .35; heading/four steps become opacity1/transform none. Before scroll initial SSR translations persist and a reduced entrance translation was observed: no claim of whole-section motionlessness. Reload/normal/live/layout/cleanup still pending. Warnings: THREE.Clock deprecations and aborted sample-video requests, no console errors. Do not close yet.

## Final verified outcome
Hydration correction verified in Chromium development server: reduce and no-preference fresh navigation and cache-disabled reload have 0 hydration notices, console errors or page errors. CircuitTrace reduce stable 5 bed/0 pulses/5 cores .35, normal 5+5 paths with changing animation values; preference changes both directions pass. Heading/four steps settle visible, normal entrance retained. No horizontal overflow at 1280/390. Commands: focused 4 tests/2 files; full 263 tests/32 files; typecheck; targeted ESLint all exit0. Owned browser/server closed, port3100 free; next-env.d.ts unchanged. Evidence /tmp/reduced-motion-t3-final/handoff.md.

## Remaining limitations and delivery
Reduced HowItWorks still translates from retained mount values y20/y24; heading settles ~0.7s and steps ~1.0s, so whole section is not fully motionless. First active connector retained scaleX0 in both preferences; not investigated, no automatic scope expansion. Warnings: 2 Vite config notices, 8 THREE.Clock deprecations, worker-performance advisory; 6 video requests canceled net::ERR_ABORTED without console/page errors. Production, other browsers, build and global lint skipped. RDD off; assessment unassessable from untracked declaration, independent verification performed (no native review receipt). No staging, commits, push or merge authorized/performed. Next: user chooses whether to address reduced entrance behavior separately or resume other website priorities.

## Authorized follow-up: reduced entrance positioning
User requested removing the remaining reduced HowItWorks entrance displacement. Preserve hydration-safe hook corrections, provider snapshots, normal entrances and all copy/layout. Scoped CSS media-query override is recommended because Motion retains translated SSR mount values; the browser preference can neutralize effective transform without changing initial markup. Exclude first connector scaleX0 observation (seen in both preferences).

- [x] T4 — Add scoped heading/step class and reduced-motion transform override plus regression coverage. Status: done (writer focused checks pass, browser pending). Route: delegated gentle-ai-worker (three-file write trigger). Allowed surfaces components/how-it-works.tsx, app/globals.css, components/how-it-works.test.tsx. Keep existing snapshot tests truthful; CSS computed behavior needs browser evidence. Observe meaningful RED/GREEN where runnable.
- [x] T5 — Independent final browser/check verification. Status: done (independent commands/browser/cleanup pass). Route: assess then gentle-ai-verify. Under reduce computed transforms none from before reveal through entrance on fresh load/reload; heading/steps visible after reveal, zero hydration errors. Normal entrance remains; no global overrides. Focused/full tests, typecheck, targeted lint. Production/other browsers outside scope. No commits authorized.

Forecast additional 30–100 diff lines (advisory); reuse feature document and memory. Next T4 bounded writer; preserve previous completed hydration evidence.

### T4 result
Scoped class on heading/four steps; transform:none !important inside existing reduced-motion media query. Two new structural tests RED then GREEN (6 focused tests pass); typecheck and targeted ESLint pass; Vite warning persists. No Motion prop/shared snapshot changes. ASSESS unassessable because untracked declaration required; RDD off; separate independent verifier required. T5 pending browser computed-style proof/full suite; no commits.

### T5 interim / tooling incident
Independent commands pass: focused6/2 files, full265/32 files, typecheck, targeted lint. Playwright wrapper unexpectedly generated .playwright-cli/page-2026-10-05T21-53-37-827Z.yml under repository cwd. No deletion/restore authorized; preserve artifact. Verifier asked to diagnose wrapper cwd-relative outputs separately, confirm no source changes, then resume only from /tmp/reduced-motion-t5-independent. Browser acceptance and cleanup pending; owned server on3100.

### Tooling incident resolved for continuation
Verifier confirmed new snapshot is an empty 0-byte about:blank artifact ignored by .gitignore:44, not tracked; all other entries predate today. Source/status match baseline and next-env.d.ts unchanged. Wrapper outputs are cwd-relative; subsequent invocations run from /tmp/reduced-motion-t5-independent. Repository snapshot retained, no deletion/restore. Browser verification resumed.

## Follow-up final verification
T5 PASS: 6 focused tests/2 files, full265/32, typecheck and targeted ESLint exit0. Chromium matrix1280/390 x reduce/normal x navigation/cache-disabled CDP reload passes. Reduce: 4,963 all-five samples (24,815 element observations), computed transform none throughout, opacity1 after reveal. Earliest samples107.6–136.3ms: no absolute first-paint claim. Normal20/24px entrance preserved (38/41 distinct transforms). CircuitTrace static/animated and live preference switching pass, zero hydration/attribute/console/page errors. Mobile shared19px layout shift before reveal observed, no transforms; during/after reveal positions stable; out-of-scope layout not investigated. Warnings16 THREE.Clock and11 video aborts; server32 warnings include preliminary run. Production/other browsers/build/global lint skipped. Owned browser/server closed, port3100free; source hashes/next-env unchanged. Evidence /tmp/reduced-motion-t5-independent/handoff.md and samples/summaries/logs. Empty ignored repo Playwright snapshot retained explicitly; no code effect. All implementation uncommitted per user-approval policy. Next user chooses truncated texts or commits.

## Delivery authorization
User explicitly approved local commits after verified closeout. Commit code, tests and this evidence as one behavior work unit; push/PR/merge remain unauthorized. Earlier no-commit statements above describe the historical implementation phase.

## Rollback boundary
Revert this work unit's CircuitTrace/HowItWorks hook corrections, scoped CSS entrance rule and corresponding tests together; do not affect web panel legibility changes.

## Work-unit commit evidence
Committed as `5b12adf89f77b5bb162e6dbc848976bb32c38310` on `feat/home-hero-clarity` (238 additions plus deletions including task evidence). Functional checks above were observed before committing; no source change at commit boundary. No push or merge.
