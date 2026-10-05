# Footer and sidebar interaction fixes

## Goal
Fix confirmed320px footer overflow and normal-motion web-sidebar wheel capture, without a build.

## User constraints
Explicitly NO BUILD until separate authorization. Preserve completed hydration/motion/label fixes and Spanish copy/design. No global overflow hiding, no shared scroll redesign, no marketing edits. Commits explicitly authorized by user after final verification; no push. Branch feat/home-hero-clarity. RDDoff. Delivery ask-on-risk, estimate60–180 diff lines advisory.

## Evidence and direction
Footer mobile grid2 cols with32px gap and nested panel32px padding yields91px contact column at320; CTA width~157px and email~145px overflow. Browser A/B already classified baseline333px document width from footer. Prefer contact spanning two mobile columns while other link columns remain2, desktop four-column layout intact; verify geometry before acceptance. Sidebar nav overflow-y-auto lacks data-lenis-prevent whereas working table/card scroll region has it; Lenis enabled only under normal preference, consistent with reported wheel failure. Local prevention marker candidate.

## Tasks
- [x] F1 — Fix footer contact sizing and add focused regression tests. Status: done (focused checks and final browser containment pass). Route: gentle-ai-worker (source/test trigger). Surfaces components/footer.tsx and components/footer.test.tsx. RED/GREEN structural tests plus types/lint; browser acceptance in F3.
- [x] F2 — Fix sidebar wheel boundary and regression coverage. Status: done (focused checks and normal/reduced-motion wheel pass). Route: gentle-ai-worker (source/test trigger). Surfaces components/panels/web.tsx and components/panels/web.test.tsx. Local data-lenis-prevent only nav; do not alter global smooth scroll.
- [x] F3 — Independent browser and regression verification, NO BUILD. Status: done (independent final verification and cleanup pass). Route: assess + gentle-ai-verify. Footer320/390/desktop plus another shared-footer page; document width<=viewport and text/button contained, no copy loss/overlap. Sidebar normal/reduce wheel changes nav not page; endpoints reachable, outside sidebar page scroll resumes, table/cards remain usable. Focused/full tests/types/targeted ESLint. Record failures/warnings/skips. No source artifacts from verifier; wrapper cwd external.

## Progress
Source map complete; prior browser causality confirmed. Clean tracked working tree; unrelated marketing untracked. Implement F1 then F2 single-threaded before F3. No production build authorized.

## F1 outcome
Contact-only col-span2 mobile/md col-span1;3 SSR tests. Corrected harness RED1 intended failure/2passes; GREEN3. Initial optional capture type error fixed; final types/lint pass. Vite config warning. ASSESS unassessable due untracked declaration, RDDoff; independent browser required in F3. NO BUILD performed.

## F2 outcome
Nav-only data-lenis-prevent with regression leaving aside unmarked. RED1failed/4passed, GREEN5passed. Types/targeted lint pass; Vite warning. Assessment unassessable untracked declaration, RDDoff; F3 independent verification required. No build, staging or commits. Parent may update only this task document during read-only verification; not verifier/source drift.

## F3 interim failed footer acceptance
Commands focused8/full271 in33 files, types/targeted lint pass. Home/privacy document widths320/390/768/1440 all equal viewport, old320overflow fixed. However at768 md4column grid155.5px tracks ends695, email717.8125/CTA729.578125 exceed grid/contact by22.8125/34.578125 though inside footer. Footer containment acceptance fails; investigate breakpoint/padding locally before claiming completion. Verifier continues sidebar checks and read-only transient fit measurements; NO BUILD. Artifacts /tmp/footer-sidebar-f3.y3RkaM.

## Measured correction direction / sidebar pass
Sidebar normal/reduce wheel0→120→50→252→0 with page550 stable; boundary native chaining550→630/470, outside nav brand550→670. Table/cards wheel0→120→50 page stable; normal opacity entrance and reduced static/no hydration errors pass. Footer768 transient explicit CSS proves2cols/contact span2/no desktop padding fits;1024 existing4cols207.5px fits. Sync grid/column padding/separators/plus marks/span reset md→lg, preserving desktop>=1024. Initial class-token experiment lacked compiled classes; explicit CSS measurement supersedes it. Wait verifier settled cleanup before single writer correction. NO BUILD.

## F1 tablet correction result
Four-column coupled classes moved md→lg: grid/gap, column padding/borders/plus marks/contact reset. Other spacing untouched. Tests RED2 failures/1pass, GREEN3; plus selector corrected to exclude LinkedIn. Types/lint pass; Vite warning remains. ASSESS unassessable untracked declaration, independent verification required; NO BUILD. Sidebar already passed actual wheel. Final footer repeat passed; see final evidence below.

## F3 final verification
PASS: focused 8/8 tests; full 271 tests across 33 files; typecheck and targeted ESLint exit 0. Chromium / and /privacidad at 320/390/768/1023/1024/1440: document width equals viewport; contact text/email/CTA contained in contact and grid. At 768 contact content [73,695], email right 218.3125, CTA right 230.078125. Two tracks/full contact span below 1024; four tracks with desktop padding/borders/six plus marks at >=1024. Normal/reduced-motion wheel nav 0→120→50 with page at 550; outside brand page 550→670, nav remains 50. No captured runtime/hydration errors. Prior table/cards checks passed. Existing warnings: Vite ESM/CommonJS config and THREE.Clock deprecation (2 browser warnings). Build explicitly EXCLUDED; production, other browsers, global lint unverified. Known mobile service-link gap spill remains in bounded scope, without page overflow/contact overlap.
Cleanup: owned Chromium closed, owned dev-server group terminated; port 3100 free. 422 baseline files unchanged including next-env.d.ts; hashChanges={}; git scope unchanged. External artifacts: /var/folders/tg/v5w13t6d2q3bcxjvcbd7ll700000gn/T/footer-sidebar-final.1bna7s4s.
User explicitly authorized local commits after final verification. F1: `25fefe2` — fix(footer): contain contact content on mobile and tablet (source and regression tests). F2: `e33dcb1` — fix(web-panel): restore sidebar wheel scrolling (source and regression test). No build or push performed.
