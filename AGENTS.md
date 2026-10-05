# Morrow agent instructions

## Project goal

Build a place-based experience-sharing app that helps people discover Richmond, BC through context, taste, and people they follow. The next milestone is a verifiable invited closed beta, including meaningful discovery and weekly return measurement. Read `CONTEXT.md` for the product model and `docs/project-status.md` for current challenges and unfinished work before starting project tasks.

## Project rules

- Before writing any code, read the exact versioned Expo docs at https://docs.expo.dev/versions/v57.0.0/ and the relevant API pages. Expo HAS CHANGED; use SDK 57 guidance and check installed versions rather than relying on older SDK behavior.
- Always ask the user for approval before enabling, adding, or calling a paid Google Maps API, including Places and Geocoding. Existing map code or a closed ticket does not grant new approval. Read `docs/operations/google-maps.md` before map configuration or behavior changes.
- Preserve optional sign-in for browsing, deliberate place selection for sharing, photo-or-caption validation, follower/private visibility, area-first location disclosure, and block/report behavior. Public profiles do not imply public experiences.
- Keep provisional places explicitly provisional. Precise coordinates and locally persisted data do not establish verification or shared persistence.
- Read `docs/architecture.md` before implementation. Reuse existing domain/service/UI boundaries and shared surface/sheet primitives. Preserve map discovery independently of list activity filters and its privacy-safe positioning.
- Keep secrets out of source and the JavaScript bundle. Use client publishable configuration for mobile Supabase access; native map keys belong in build configuration with platform restrictions. Read the relevant guide under `docs/operations/` for auth or beta setup.
- Keep durable native changes in Expo configuration/plugins; generated `ios/` and `android/` are ignored. Validate native changes in a compatible development build, including cold launch when scene-lifecycle configuration changes.
- For code changes, run `npm run typecheck` and `npm test`, plus relevant native/backend checks. For documentation-only changes, verify links, factual claims, and the `CLAUDE.md` symlink. Report limitations and baseline failures explicitly.
- GitHub Issues are the live work tracker. Read `docs/agents/issue-tracker.md` for ticket operations and `docs/agents/triage-labels.md` when triaging. Closed issues, passing mocked tests, and configured build profiles do not prove deployment, device acceptance, or beta outcomes.
- Update the relevant context/status/operations document when an authorized change alters its facts. Keep `AGENTS.md` authoritative and `CLAUDE.md` as a relative symlink to it.

## Behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
