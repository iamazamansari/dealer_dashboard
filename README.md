# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Environment

This demo uses OpenStreetMap's geocoding service (OSM) for address lookup and validation by default, so you do not need a Google API key to run features locally.

### OpenStreetMap (OSM) fallback — how it works
- By default the app uses a small client-side lookup against OSM's public HTTP API for address autocomplete and reverse lookups.
- For production we strongly recommend proxying these requests through your backend (see `server/osm-proxy/`) and adding caching and a distinct User-Agent header to comply with OSM usage policies.

Advantages of using OSM for this demo:
- No API key or billing required — good for prototypes and demos.
- Global coverage for basic address lookup and reverse geocoding.
- Simple to swap in as a fallback when commercial APIs (Google/Alibaba) are unavailable.

Limitations compared to Google/Alibaba:
- OSM's public endpoints are rate-limited and not intended for high-volume production use.
- Place detail richness (POI metadata, types, internationalized place names) is typically less extensive than Google/Alibaba.
- No premium SLAs or commercial features (routing, advanced place matching, premium support).

If you prefer to use Google Maps in production, you can add a key and enable the associated APIs (Maps JavaScript API, Places API, Geocoding API). For production, proxy geocoding requests through your backend and add caching to stay within usage limits.

---

Notes about the recent cleanup (developer housekeeping):
- Removed duplicate implementations for `DealerMap` and `AddressAutocomplete` and consolidated them to single canonical files: `src/components/DealerMap.tsx` and `src/components/Address-autocomplete.tsx` respectively. This reduces confusion and makes imports consistent across the app.
- The `Setup-instructions` component was shortened to a brief pointer to the README; the README now contains the authoritative setup and production recommendations.
- Address autocomplete still uses OSM by default. If you'd like Google as an option, we can add a small provider switcher or abstraction, but the codebase is now simplified and ready for review.

If you'd like I can open a short PR branch and commit message describing these changes for your review.

### Running the optional OSM proxy (recommended for production)
1. Install dependencies (from project root):
   ```bash
   npm install express node-cache node-fetch
   ```
2. Start the proxy helper (optional):
   ```bash
   node server/osm-proxy/index.js
   ```
3. Example usage (from your app or curl):
   - GET `http://localhost:4000/api/geocode?q=10+Downing+St`
   - GET `http://localhost:4000/api/reverse?lat=51.5034&lon=-0.1276`

Notes:
- Add rate limiting and persistent caching for production workloads.
- Always set a distinct User-Agent header when talking to OSM's servers.


