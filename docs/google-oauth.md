# Google sign-in setup

1. In Google Cloud, create an OAuth 2.0 client for a **Web application**.
2. In Supabase Dashboard, open **Authentication → Providers → Google**, enable Google, and paste that client’s ID and secret.
3. In **Authentication → URL Configuration**, add `morrow://auth/callback` as a redirect URL.
4. Build the native app after adding the `morrow` scheme. Expo Go cannot receive this custom redirect.

The Google client secret stays only in Google Cloud and Supabase—never in `.env` or the mobile app.
