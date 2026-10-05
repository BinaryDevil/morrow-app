# Google Maps native keys

Before enabling, adding, or calling any paid Google Maps API, obtain user approval under [AGENTS.md](../../AGENTS.md). This setup guide does not grant approval.

Morrow uses Google Maps only through the native `react-native-maps` provider. Supply the platform keys as `GOOGLE_MAPS_IOS_API_KEY` and `GOOGLE_MAPS_ANDROID_API_KEY` during a native build; do not put either value in the JavaScript bundle or commit it to the repository.

Before a release, restrict each key in Google Cloud:

- Restrict the iOS key to Morrow's bundle identifier: `com.binarydevilteam.morrowapp`.
- Restrict the Android key to Morrow's Android application ID and signing-certificate SHA-1 fingerprints.
- Limit both keys to the Maps SDK for Android or Maps SDK for iOS, respectively. Do not enable Geocoding API or Places API for these keys.

The posting flow intentionally does not reverse-geocode dropped pins or search Places. When a person drops a pin, they provide the displayed address themselves and Morrow saves the location as provisional until it can be verified.
