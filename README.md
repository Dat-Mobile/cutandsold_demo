# Cut & Sold Take-Home Technical Report

demo: https://cutandsolddemo.vercel.app/moves

## 1. Brief Interpretation

The take-home brief asked for a focused frontend prototype inspired by Cut & Sold product scenarios. The exercise evaluates the ability to translate Figma direction into a real UI, reason about the product concepts of **Moves** and **Boards**, use AI and manual frontend execution effectively, and balance speed, quality, scalability, polish, interaction, responsiveness, and UX judgment.

The required product areas were:

- **Moves**: a feed of content cards combining image, text, metadata, content-type tags, insights, save state, and a detail sheet.
- **Boards**: a grid-based image collection view using the same move data, where imagery becomes the primary focus and each image can open its related move.

This implementation is a React/Vite web app with two primary routes:

- `/moves`
- `/boards`

The result is intended as a polished interactive prototype rather than a full production product.

## 2. Implementation Summary

The app implements the core brief requirements:

- API-backed Moves feed.
- Moves sub-navigation for `New`, `Direct Competitors`, `Adjacent Competitors`, `Inspiration`, `Regional`, and `Global`.
- Consistent card UI across tabs, with only API query state changing.
- Move cards with main image, brand logo, country flag, content-type pills, title, insights, save state, and detail-sheet clickthrough.
- Hover motion for imagery and insight affordances.
- API-backed Boards grid.
- Board filters for brand, content type, and country.
- Board grid density controls.
- Board cards with brand identity and source-move clickthrough.
- Shared move detail sheet with title, subtitle, content types, additional images, date, source link, insights, and save state.

The implementation also includes loading, empty, and error states for the major API-backed surfaces.

## 3. Tech Stack

| Area          | Choice                         | Why                                                                                          |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| Framework     | React 19                       | Fits the requested frontend stack and keeps UI split into clear component boundaries.        |
| Language      | TypeScript                     | Helps model API responses and normalizes inconsistent response fields safely.                |
| Build Tool    | Vite                           | Fast iteration, simple environment handling, and straightforward static deployment.          |
| Styling       | Tailwind CSS v4                | Enables fast high-fidelity design tuning with exact spacing, colors, gradients, and shadows. |
| Data Fetching | TanStack Query v5              | Handles cache, loading states, retries, query keys, and conditional fetching.                |
| Routing       | React Router v7                | Provides `/moves` and `/boards` routing plus URL-backed feed tab state.                      |
| Icons         | Lucide React                   | Consistent icon system with simple size/stroke customization.                                |
| Deployment    | Vercel-compatible static build | Matches the brief's hosted-site expectation.                                                 |

## 4. Project Structure

```text
src/
  App.tsx
  main.tsx
  index.css
  lib/
    api/
      client.ts
      queries.ts
      types.ts
    cn.ts
  features/
    moves/
      MovesFoundation.tsx
      MoveCard.tsx
      MoveDetailSheet.tsx
      normalizeMove.ts
    boards/
      BoardsFoundation.tsx
      BoardCard.tsx
      normalizeBoard.ts
```

The codebase is organized by feature rather than by technical layer. Shared infrastructure lives under `src/lib`, while Moves and Boards keep their UI and normalization logic near the components that consume it.

## 5. API Integration

The brief provides four endpoints. The app integrates all four through `src/lib/api/client.ts`.

### Endpoint Mapping

| Brief Endpoint                   | Client Function              | Query Hook        | Used By           |
| -------------------------------- | ---------------------------- | ----------------- | ----------------- |
| `get-feed-moves`                 | `getFeedMoves`               | `useFeedMoves`    | Moves feed        |
| `get-board-images`               | `getBoardImages`             | `useBoardImages`  | Boards grid       |
| `get-board-image-filter-options` | `getBoardImageFilterOptions` | `useBoardOptions` | Boards filters    |
| `get-move-details`               | `getMoveDetails`             | `useMoveDetails`  | Move detail sheet |

The API base URL is:

```text
https://saint-laurent.supplyandfriends.com/api/data/take-home
```

Authorization is passed through:

```text
VITE_TAKE_HOME_API_TOKEN
```

`vite.config.ts` also supports `TAKE_HOME_API_TOKEN` and maps it into `import.meta.env.VITE_TAKE_HOME_API_TOKEN`, which makes local setup more forgiving.

### Query Defaults

`src/main.tsx` configures TanStack Query with:

- `staleTime: 60_000`
- `retry: 1`
- `refetchOnWindowFocus: false`

This keeps the prototype responsive without refetching too aggressively during normal browsing.

### Development Logging

`client.ts` currently logs each API response:

```ts
console.log(`[api:${path}]`, { url, params, data });
```

This was added to inspect the four API payloads while refining normalization and UI mapping. In production, this should be gated behind a development flag or removed.

## 6. Vercel Serverless Proxy and CORS Resolution

During deployment work, the browser could not reliably call the upstream take-home API directly from the hosted frontend because of cross-origin restrictions and because the brief token should not be treated as public client configuration. To solve that, I implemented a Vercel Serverless Function proxy at:

```text
api/take-home/[endpoint].js
```

That file has since been removed from the current working tree while iterating on the local/direct API setup, but the implementation was:

```js
const API_BASE_URL =
  "https://saint-laurent.supplyandfriends.com/api/data/take-home";

const ALLOWED_ENDPOINTS = new Set([
  "get-feed-moves",
  "get-board-images",
  "get-board-image-filter-options",
  "get-move-details",
]);

export default async function handler(request, response) {
  const endpoint = request.query.endpoint;
  const authToken = process.env.TAKE_HOME_API_TOKEN;

  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    response.status(404).json({ error: "Unknown take-home endpoint" });
    return;
  }

  if (!authToken) {
    response.status(500).json({ error: "Missing TAKE_HOME_API_TOKEN" });
    return;
  }

  const upstreamUrl = new URL(`${API_BASE_URL}/${endpoint}`);

  for (const [key, value] of Object.entries(request.query)) {
    if (key === "endpoint") continue;
    if (Array.isArray(value)) {
      value.forEach((item) => upstreamUrl.searchParams.append(key, item));
    } else if (value !== undefined) {
      upstreamUrl.searchParams.set(key, value);
    }
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    headers: {
      Authorization: authToken,
    },
  });

  const body = await upstreamResponse.text();
  response.status(upstreamResponse.status);
  response.setHeader(
    "content-type",
    upstreamResponse.headers.get("content-type") || "application/json",
  );
  response.send(body);
}
```

### How the Proxy Worked

The frontend would call same-origin URLs such as:

```text
/api/take-home/get-feed-moves?viewState=new_all&limit=10&offset=0
```

Vercel routed that request to the serverless function. The function then:

1. Validated `endpoint` against an allowlist, so the proxy could only call the four take-home endpoints.
2. Read `TAKE_HOME_API_TOKEN` from Vercel server-side environment variables.
3. Reconstructed the upstream API URL and forwarded query parameters, excluding the dynamic route parameter `endpoint`.
4. Sent the Authorization header from the server, keeping the token out of the browser bundle.
5. Returned the upstream status code, content type, and response body to the client.

This fixed the CORS issue because the browser only communicated with the same Vercel origin. The serverless function performed the cross-origin request server-side, where browser CORS restrictions do not apply.

### Why This Approach Was Useful

- It avoided exposing the bearer token in client-side JavaScript.
- It constrained proxy access to the required endpoint allowlist.
- It preserved all query parameters required by the brief.
- It kept the frontend API client simple because every take-home request could be represented as a single endpoint name plus params.
- It made Vercel deployment more robust than relying on upstream CORS behavior.

If restoring this proxy, `client.ts` should point to `/api/take-home/${path}` in production and omit the browser-side Authorization header. Vercel should define:

```text
TAKE_HOME_API_TOKEN=Bearer <token-from-brief>
```

## 7. Data Modeling and Normalization

The API returns data with mixed naming conventions and optional nested fields. To avoid spreading API-shape concerns throughout the UI, the app uses normalization files:

- `features/moves/normalizeMove.ts`
- `features/boards/normalizeBoard.ts`

### Normalized Move

`normalizeMove` converts feed and detail responses into a stable `NormalizedMove`:

- `id`
- `title`
- `subtitle`
- `imageUrl`
- `brandName`
- `brandLogoUrl`
- `countryName`
- `countryFlagUrl`
- `contentTypes`
- `insights`
- `date`
- `sourceName`
- `sourceUrl`
- `additionalImages`

This allows `MoveCard` and `MoveDetailSheet` to share one UI-facing data model even though feed and detail responses may differ.

### Normalized Board Image

`normalizeBoardImage` maps board image records into:

- image URL,
- original dimensions,
- source move id,
- brand name,
- brand logo.

The original width and height are used to preserve image aspect ratios in the Boards grid.

### Normalized Board Option

`normalizeBoardOption` converts brand, content type, and country filter options into a shared shape with:

- `id`
- `label`
- optional `imageUrl`

## 8. Moves Implementation

`MovesFoundation.tsx` owns the Moves route.

### Navigation

The feed supports the view states requested by the brief:

- `new_all`
- `competition`
- `adjacent`
- `inspired_all`
- `inspired_regional`
- `inspired_global`

The active tab is stored in the URL query string with `useSearchParams`, so a selected tab survives refresh and can be shared.

### Cards

`MoveCard.tsx` implements the main feed unit:

- large visual image area,
- brand badge in the top-left,
- country flag in the top-right,
- gradient footer overlay,
- content-type pills,
- title,
- insight rail,
- save/bookmark button,
- hover image motion,
- hover insight color transition.

The current save behavior is visual state only, as the brief said persistence is not required.

### Detail Sheet

Clicking a move opens `MoveDetailSheet.tsx`.

The sheet uses the selected feed item as fallback content and then fetches full detail data using `get-move-details`. It displays:

- image gallery,
- title,
- subtitle,
- content types,
- country flag,
- brand identity,
- date,
- insights,
- source link,
- save state.

## 9. Boards Implementation

`BoardsFoundation.tsx` owns the Boards route.

### Filter Strategy

The brief asks Boards to support multiple board image views and a `targetId` for `by_brands`, `by_content_type`, and `by_country`. The implementation focuses the UI around these three high-value filter views:

- By Brands
- By Content Type
- By Country

It fetches all three option lists and lets the user expand/select the active option group. The selected option determines the `targetId` passed into `get-board-images`.

### Density Controls

The Boards page supports three layout densities:

- relaxed,
- standard,
- dense.

These map to two, three, and four column CSS-column layouts. The API request limit also scales with density so denser views receive more images.

### Board Cards

`BoardCard.tsx` renders each board image:

- image aspect ratio from API dimensions,
- source brand logo or brand name,
- hover gradient,
- bookmark affordance,
- view source move action.

Clicking the source move CTA opens the shared move detail sheet.

## 10. Shared State and Route Context

`App.tsx` owns shared saved-move state:

```ts
const [savedMoveIds, setSavedMoveIds] = useState<Set<number | string>>(...)
```

This state is passed into both Moves and Boards so the detail sheet can show the same visual save state regardless of where it was opened. It is intentionally in-memory because persistence was not required by the brief.

`App.tsx` also owns lightweight route context for both primary surfaces so user choices survive navigation between `/moves` and `/boards`:

- Moves remembers the active feed tab and any open move detail.
- Boards remembers the active board view, expanded filter group, selected filter target ids, grid density, and any open source-move detail.

This is intentionally kept in React state rather than local storage. It preserves context during a normal product browsing session without making stale filters persist across separate visits.

## 11. Visual and Interaction Decisions

The UI direction follows the supplied Figma/image references: quiet editorial layout, large fashion imagery, muted typography, minimal controls, and precise spacing.

Specific polish decisions include:

- gradient title text for primary section titles,
- soft gray app surfaces,
- large image-first move cards,
- subtle image scaling on hover,
- gradient overlays for text legibility,
- aligned insight/save icon rail,
- rounded flag treatment with shadow,
- focus-visible outlines for keyboard users,
- careful line-height tuning to avoid clipped text.

The app uses the requested font stack conceptually through CSS:

```css
'SK Modernist', 'Helvetica Neue', Inter, ui-sans-serif, system-ui
```

If the actual SK Modernist files are available in the deployment environment, they can be added as `@font-face` assets.

## 12. Environment and Setup

### Install

```bash
npm install
```

### Configure API Token

Create `.env.local`:

```bash
cp .env.example .env.local
```

Set:

```bash
VITE_TAKE_HOME_API_TOKEN="Bearer <token-from-brief>"
```

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173/
```

The app redirects `127.0.0.1` to `localhost` in development to align with the API CORS allowlist.

## 13. Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 14. Deployment

The project includes `vercel.json` for Vercel deployment:

- build command: `npm run build`
- output directory: `dist`
- framework: `vite`
- SPA rewrite to `index.html`

The hosted environment must define `VITE_TAKE_HOME_API_TOKEN`.

If the serverless proxy is restored for production, the hosted environment should instead define `TAKE_HOME_API_TOKEN`, and client requests should go through same-origin `/api/take-home/*` routes.

## 15. Verification

The project was validated with:

```bash
npm run build
```

Recommended manual test pass:

- `/moves` loads the New feed.
- Each Moves tab changes data while preserving card structure.
- Switching from Moves to Boards and back restores the previous Moves tab/detail context.
- Move card click opens the detail sheet.
- Detail sheet loads full move details.
- Save icon toggles visual state.
- Insight rail hover state animates.
- `/boards` loads board images.
- Board filter groups expand and select options.
- Density controls change grid layout.
- Switching from Boards to Moves and back restores the previous Board filter, selected option, expanded group, density, and detail context.
- Board source move CTA opens the detail sheet.
- API error and empty states render without crashing.

## 16. Known Trade-offs

- Save state is visual and in-memory only.
- Pagination/infinite scroll was not implemented.
- Board masonry uses CSS columns instead of a masonry library.
- API response logs are currently enabled for debugging.
- No automated tests are included.
- Mobile responsiveness is functional but not as deeply tuned as desktop, where the supplied references appear to focus.
- The current working tree calls the external API directly from the browser. A Vercel serverless proxy was implemented earlier to solve CORS and hide the token, and can be restored for production deployment.

## 17. Future Improvements

If extending the prototype, the next steps would be:

- Add persistent saved moves.
- Add pagination or infinite loading.
- Add route-addressable move detail pages.
- Add Playwright smoke tests for Moves, Boards, and detail sheet flows.
- Add unit tests for normalization functions.
- Gate API logging behind `import.meta.env.DEV`.
- Restore the Vercel serverless API proxy for hosted production builds.
- Add actual bundled SK Modernist font files.
- Improve small-screen layouts with a mobile-specific navigation treatment.
