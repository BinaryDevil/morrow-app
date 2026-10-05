# Morrow

Morrow helps people discover places in Richmond, BC through contextual experiences and people they follow. The current app is an Expo native MVP with guest browsing, account-backed sharing, and feed/map discovery. Beta readiness still needs work; closed issues are not evidence of a completed beta.

## Project documentation

- [Product context](CONTEXT.md): goal, vocabulary, privacy model, and scope.
- [Current status and unfinished work](docs/project-status.md): dated evidence, challenges, and completion checks.
- [Architecture](docs/architecture.md): code boundaries and native constraints.
- [Documentation index](docs/README.md): setup guides and agent workflows.
- [Agent instructions](AGENTS.md): project rules and coding behavior. `CLAUDE.md` is a symlink to this file.

## Local development

Install dependencies with `npm ci`. Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to an ignored `.env` for account-backed flows. These are client configuration; keep backend secrets out of the app.

Use `npm start` for Metro and `npm run ios` or `npm run android` for a native development build. Native builds need the corresponding platform toolchain. Before supplying keys or running a build that enables paid Google Maps services, obtain user approval under [AGENTS.md](AGENTS.md). See the [map setup guide](docs/operations/google-maps.md).

Run `npm run typecheck` and `npm test` for local validation. Native runtime, hosted authorization, and cross-device behavior need separate checks. EAS profiles are configured in `eas.json`; configuration alone does not establish a distributed build.
