# Architecture

## Code boundaries

| Location | Responsibility |
| --- | --- |
| `index.ts`, `App.tsx` | App entry, centralized screens/sheets, session state, and UI composition |
| `src/domain/` | Pure account, place, experience, ranking, following, location, and safety rules with tests |
| `src/lib/` | Supabase-facing account/experience/following/safety/analytics services and local catalogue storage |
| `src/ui/` | Shared surface treatment, discovery navigation, and boot-screen helpers |
| `supabase/migrations/` | Profiles, experiences, follows, storage policies, safety controls, and cohort metrics |
| `app.json`, `app.config.js`, `eas.json` | Expo configuration, native plugins, and build profiles |

There is no implemented screens/components migration or Expo Router layout. Keep application changes scoped; the centralized UI is not authorization for a broad rewrite.

## Data flow and limits

`App.tsx` loads the session, profile, experiences, local people, and blocks through services. Ranking combines authenticated records with bundled sample experiences. Activity filtering affects the list; discovery markers derive from the eligible map feed independently of that list filter. Preserve privacy-safe marker positioning.

Curated places come from `src/domain/places.ts`. Community suggestions persist through AsyncStorage in `src/lib/place-catalogue-service.ts`; no shared place catalogue migration/service exists. Experience rows contain a place identifier, so another device can lack the referenced provisional record. Saved-place intent has per-account local retry storage; audit the UI's experience/place identifiers before claiming canonical place saving.

Native auth uses SecureStore; web storage uses AsyncStorage. Experience photos upload to a private storage bucket and are read through signed URLs. Repository migrations express intended row/storage access; hosted application and enforcement require separate verification.

## Native constraints

The manifest currently targets Expo SDK 57, React Native 0.86, and React 19.2. Read the [exact SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) before coding; dependency versions remain authoritative in `package.json` and the lockfile.

`react-native-maps` supplies the Google native provider. Platform key injection is in `app.config.js`; see [map operations](operations/google-maps.md) and the approval rule in `AGENTS.md`.

`expo-ios-scene-lifecycle-plugin` is configured as a temporary Xcode 27 / iOS 27 compatibility workaround. Confirm native cold launch after regenerating/building; JavaScript tests cannot validate scene adoption. Generated `ios/` and `android/` folders are ignored, so durable native configuration belongs in config/plugins.

`MorrowSurface` supplies blur and reduced-transparency fallback, with an opaque Android fallback. `MorrowSheet` centralizes dismissal; unsafe in-progress writes can lock dismissal. Validate sheet sizing, backdrop dismissal, keyboard, home-indicator spacing, reduced motion/transparency, and overlay contrast on actual native builds.
