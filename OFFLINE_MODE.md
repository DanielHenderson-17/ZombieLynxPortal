# Offline website mode

The website defaults to offline mode, configured in `client/src/config/siteMode.js`.

- Login, registration, password recovery, and email verification routes show a Service offline modal over the homepage.
- The modal supports keyboard focus, Escape, and Back to homepage.
- Saved login tokens are retained, but offline mode does not restore sessions or call the authentication API.
- Server status uses `client/src/utils/offlineServers.js`, with all entries offline and zero players. Voting and joining are disabled.
- Existing backend code and authentication pages are preserved.

## Restore online mode

Set `VITE_SERVICES_OFFLINE=false` in the frontend build environment and rebuild/redeploy. Any other value (or an unset variable) keeps offline mode enabled. Vite settings are applied at build time.

This restores the portal routes from the existing pre-refactor router, session restoration, and the original live server-status component. `OnlineApplicationViews.jsx` and `LiveServerStatusDisplay.jsx` preserve those implementations separately from the offline UI.

Before enabling, restore and verify the .NET API, databases, SMTP, and game integrations. The frontend still expects `/api` on the website origin; configure a proxy if hosting the API separately. Changing this flag does not deploy the backend, change DNS, or disable backend endpoints.

Other public content and navigation are unchanged; this is not a full migration of the website to static hosting.

## Vercel deployment

Import this repository into the intended Vercel team and set Root Directory to `client`. `client/vercel.json` configures Vite, the build output, and direct SPA routes such as `/login` and `/register`.

Set `VITE_SERVICES_OFFLINE=true` for Preview and Production. No backend secrets are required. For local CLI uploads, `client/.vercelignore` excludes environment files, dependencies, and generated output.

Deploy and verify a temporary Vercel URL before changing the website DNS. Keep the existing DNS zone and unrelated records. Use the exact domain records supplied by Vercel when connecting `zlg.gg`.

Bundle analysis is disabled for normal builds. Set `ANALYZE=true` only when intentionally generating `build/stats.html`.
