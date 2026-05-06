# Cut & Sold Take-Home

React + Tailwind + TanStack Query implementation for the Moves and Boards take-home.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- TanStack Query
- Lucide icons

## Local Setup

```bash
npm install
npm run dev
```

The app runs at `http://127.0.0.1:5173/` by default.

## Scripts

```bash
npm run lint
npm run build
npm run preview
```

## Product Scope

- Moves feed with sub-navigation, API-backed cards, content type pills, brand logo, country flag, hover subtitle, insight rail, and visual save state.
- Move detail side sheet backed by `get-move-details`.
- Boards image grid using the same move data, view filters, density toggle, hover CTA, and click-to-detail.

## Deployment

Recommended deployment target: Vercel.

Build settings:

- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

The project includes `vercel.json` with these settings.

## Notes

- The API token is used client-side because the take-home API is called directly from the browser.
- Figma MCP was not available in this Codex session, so Figma REST API screenshots/metadata were used for implementation reference.
