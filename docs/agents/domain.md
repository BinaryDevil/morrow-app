# Domain Docs

How engineering skills should consume this repo's domain documentation.

## Before exploring

- Read `CONTEXT.md` at the repository root when it exists.
- Read relevant decisions under `docs/adr/` when they exist.

If these files do not exist, proceed silently. The domain-modeling workflow creates them when terminology or an architectural decision has actually been settled.

## File structure

This is a single-context repository:

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Vocabulary and decisions

Use terminology defined in `CONTEXT.md` for issues, tests, and implementation proposals. If output contradicts an existing ADR, surface the conflict rather than silently overriding it.
