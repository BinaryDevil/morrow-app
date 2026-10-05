# Project status and unfinished work

Reviewed: 2026-10-04 (America/Vancouver). Evidence: repository at `0d4d981`, source/configuration/migrations, and live GitHub issue/PR listings. This is a code and tracker review, not a hosted database, release, or device acceptance audit.

## Current challenge

Move the implemented discovery/sharing MVP to a credible Richmond closed beta. The main gap is shared, trustworthy data and end-to-end verification: the app still mixes sample content with real records, provisional places are device-local, and native/backend/beta outcomes remain unverified.

## Tracker and implementation

[GitHub issues #1–#18](https://github.com/BinaryDevil/morrow-app/issues?q=is%3Aissue) are all closed; no open PRs were returned at review time. Closed tickets still contain unchecked acceptance lists. Treat closure as tracker state, not evidence that every acceptance criterion or the beta outcome has been verified.

| Area | Present in the repository | Practical limit |
| --- | --- | --- |
| Accounts and guest access (#1, #8) | Guest discovery, password/Google auth, profile preferences/privacy, saved-state service and local retry | Live auth, callback configuration, and cross-session/device behavior need acceptance checks |
| Places and sharing (#2, #3, #10–#12, #16) | Richmond seeds, provisional pins, map confirmation, photo/caption validation, upload and experience persistence | Shared place/address persistence required by #10 is absent |
| Social discovery (#4, #5) | Follow/unfollow, mutual-follow labels, Following destination, contextual ranking and explanations | Sample content is still mixed in; contextual-heart writes are absent |
| Safety (#6) | Visibility rules, area-first location disclosure, report/block services and SQL policies | Hosted row/storage enforcement and operational report handling remain unverified |
| Beta measurement (#7) | Cohort/event/threshold migrations, best-effort events, weekly/week-four views | No evidence here of enrolled testers, agreed thresholds, completed cohort weeks, or measured outcomes |
| Native discovery UI (#9, #13–#18) | Feed/Map switcher, immersive map, category markers, dismissible sheets, shared surfaces | Native acceptance across target platforms/accessibility settings remains to be recorded |

## Unfulfilled work

These are review findings and verification needs, not newly created GitHub tickets. Priorities below are suggested sequencing, not approved feature scope.

1. **Shared place catalogue and address integrity.** Seeds are bundled; provisional records live only in AsyncStorage. Curated addresses are optional and many seeds omit them. Define shared place persistence and verification, then demonstrate that an experience's place/address resolves on a second device after restart. Reconcile this with [closed #10](https://github.com/BinaryDevil/morrow-app/issues/10).
2. **Real discovery content and provenance.** `App.tsx` always appends sample experiences, including synthetic relationship/heart signals and stock imagery. Seed records are marked verified by a helper, without per-place verification evidence in the model. Decide how demo content is identified or replaced for beta, audit launch records, and verify guest versus authenticated discovery without widening follower/private access implicitly.
3. **Canonical saving and agreement flows.** Feed saving passes experience IDs while catalogue saving uses place IDs; confirm intended saved-place identity before claiming consistency. Contextual-heart count/ranking and a pure toggle helper exist, but no UI/service write flow does. Verify one saved place across surfaces/devices; specify and verify authenticated agreement persistence if it remains beta scope.
4. **Failure and retry behavior.** Initial experience/people/block loads catch failures as empty results. Save retry occurs during profile loading, rather than an explicit connectivity listener. Verify errors are distinguishable from genuinely empty data and that recovery retains intent; document actual retry behavior.
5. **Backend and safety acceptance.** Confirm migrations, auth providers/redirects, private photo access, follower/private restrictions, and blocking with separate author/follower/non-follower accounts in the intended environment. Establish who handles reports. Do not infer deployment from SQL files or mocked tests.
6. **Native build acceptance.** Validate current iOS cold launch with the scene-lifecycle workaround and Android behavior, OAuth return, photo selection/upload, map keys, sheet/keyboard/safe-area behavior, and accessibility fallbacks. Record build/device versions and results. Paid map enablement or calls require approval under `AGENTS.md`.
7. **Closed-beta execution.** Agree thresholds, enroll testers, distribute a verified build, run sign-in → discovery → saving → sharing → following checks, and confirm event recording. Evaluate week four only once cohort windows complete. [Metric setup](operations/closed-beta-metrics.md) contains placeholder rates, not agreed targets.

## Verification record

Checks run on 2026-10-04:

- Documentation links resolve; `CLAUDE.md` is a relative symlink to `AGENTS.md` and reads identical content.
- `git diff --check` and `npm run typecheck` pass.
- `npm test`: all 16 suites / 42 tests pass, but the command exits 1 due to an ExpoModulesCoreJSLogger warning after tests complete (`Cannot log after tests are done`). Application code, dependencies, and test configuration were unchanged in this documentation task. The test command is not fully green; investigate the Expo/Jest teardown separately.

No hosted migrations, paid map calls, native builds, or beta operations were performed as part of this review.

When updating this page, record the reviewed revision/date and evidence. Move a gap to completed only when its stated completion check is met; create or reopen tracker work when authorized.
