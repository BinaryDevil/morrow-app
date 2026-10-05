# Documentation map

| Document | Purpose | Read when |
| --- | --- | --- |
| [CONTEXT.md](../CONTEXT.md) | Product goal, scope, and terminology | Starting project work |
| [Project status](project-status.md) | Current challenge, unfinished work, and verification gaps | Selecting work or reporting readiness |
| [Architecture](architecture.md) | Implementation boundaries and native constraints | Changing code or diagnosing runtime behavior |
| [Google sign-in](operations/google-oauth.md) | Provider and redirect setup | Configuring or checking authentication |
| [Google Maps](operations/google-maps.md) | Native keys and pin/address behavior | Working on maps or native builds |
| [Closed-beta metrics](operations/closed-beta-metrics.md) | Cohort setup and week-four evaluation | Preparing or evaluating the beta |
| [Issue tracker](agents/issue-tracker.md) | GitHub workflow | Reading or updating tickets |
| [Triage labels](agents/triage-labels.md) | Canonical label meanings | Triaging tickets |
| [Domain documentation](agents/domain.md) | Context and decision-reading workflow | Changing terminology or architecture |

Keep durable product definitions in `CONTEXT.md`, the dated readiness assessment in `project-status.md`, and operational instructions in `operations/`. GitHub Issues remain the live work tracker. Refresh the status review when implementation or verification changes; retain the distinction between code present, locally verified, deployed, and tested with real users.
