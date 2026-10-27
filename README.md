# Find a Park

Residents browse local parks on a map, in a list, and on a detail page. This is a front-end proof of concept: the parks live in a static JSON file, and the app runs in the browser.

## Run

Node.js `^20.19.0` or `>=22.12.0` (the range Vite 8 declares).

```bash
npm install
npm run dev
```

Vite prints a local URL, typically http://localhost:5173. No environment variables.

| Script | What it does |
| --- | --- |
| `npm test` | Vitest, one run |
| `npm run lint` | ESLint |
| `npm run build` | `tsc -b`, then a production build |
| `npm run preview` | Serves that production build |

## What works

- **Home (`/`).** Every park is in the list, and parks with a location are on the map. On a phone, Open map and Show list switch between them. On a wider screen, the map fills the page and the list sits beside it. The map works without your location.
- **Detail (`/park/:id`).** Shows the name, address, description, amenities, hours, photos, size, and rating. Missing text is labeled or the row is left out. An unknown park says "Park not found".
- **Search.** A name, address, or amenity filters the list and the map together. The query stays in the URL, so going back from a park keeps it.
- **Keyboard.** Tab to a park in the list and press Enter to open it. The focused control is easy to see.

## What was left out

The time budget is 2 hours, so the app stays inside the must-haves.

- Backend, accounts, and deployment.
- Geolocation, distance, and any "near me" ordering.
- Filters beyond that one text query.
- Browser end-to-end tests. The tests are Vitest and React Testing Library.
- Local copies of the photos. Images are hotlinked.

## Key decisions

- **Stack.** Vite, React, TypeScript, Tailwind CSS, React Router, and react-leaflet on OpenStreetMap tiles. Tests use Vitest and React Testing Library.
- **No API keys.** Map tiles and photos are public URLs.
- **Search in the URL.** The query is `?q=`, so the list and the map stay in sync and Back keeps the search.
- **Normalize once.** Park data is cleaned once at startup. The UI reads it through `getParks()` and `getParkById()`.

## Data changes

Sample image URLs were replaced with hotlinked Wikimedia Commons photos. Fictional parks use representative stand-in photos. Highland Dog Park is left without images.

## Known issues

- Hotlinked images depend on Wikimedia (sample data).
- Implementation is intentionally quite simple because of time constraints, but a public API, or geolocation would have made this much cooler.

## How it was checked

- Unit tests cover `normalizeParks` and the format helpers (`src/data/parks.test.ts`), the detail page with the known missing fields and a failed image (`src/pages/ParkDetailPage.test.tsx`), and `filterParks` (`src/lib/filterParks.test.ts`). The plan runs those tests once, in W5.T1, so this track did not run them.
- `npm run lint`, `npm test`, `npm run build`, and the manual pass at 375px and 1280px (keyboard only from the list to a detail page and back) belong to W5.T1. Results go in [Verification results](#verification-results).

## Time spent

The track chats did not record start and stop times, and I was working on this on and off through morning. Honest assesment a little over 2.5 hours, hard to gauge with pauses in the middle. Used Wave / Track / Sequencing methods to have agents run in parallel to meet time constraints.

## Next steps before public use

- Replace the static JSON with a parks API, so data stays current without a redeploy.
- Move to a production map provider (for example Mapbox or Google Maps). That needs API keys kept in environment config, not in the repo.
- Host real park photos instead of hotlinked stand-ins.

## AI conversation logs

Every chat used for this project is kept in `ai-logs/`, unedited. That includes the planning chat, each Wave/Track chat, and an outside review of the plan. The work was split into those Wave/Track prompts. The prompts, and the files each track may edit, are in `PLAN.md`.

All logs are in `ai-logs/transcripts/`. The numbered `.jsonl` files are raw Cursor transcripts in the order they ran, each renamed for its track and otherwise unchanged. There were no separate commit chats.

- `00-planning.jsonl`: planning chat that produced `PLAN.md`, `progress.md`, and the shared rule.
- `01-W1.T1-scaffold.jsonl`: W1.T1 scaffold.
- `02-W2.T1-data-layer.jsonl`: W2.T1 data layer.
- `03-W2.T2-ui-primitives.jsonl`: W2.T2 UI primitives.
- `04-W2.T3-map-component.jsonl`: W2.T3 map component.
- `05-W3.T1-home-page.jsonl`: W3.T1 home page.
- `06-W3.T2-detail-page.jsonl`: W3.T2 detail page.
- `07-W4.T1-search.jsonl`: W4.T1 search.
- `08-W4.T2-readme-draft.jsonl`: W4.T2 README draft.
- `09-bugfix-planning-W2.T4-W4.T3.jsonl`: parent chat that ran the RCAs and the two bugfix tracks before W5.T1, through the subagents below.
- `09a-subagent-rca-map-keyboard.jsonl`: subagent, read-only RCA for keyboard access to map markers.
- `09b-subagent-rca-search-back-link.jsonl`: subagent, read-only RCA for "Back to all parks" dropping the search.
- `09c-subagent-W2.T4-map-marker-keyboard.jsonl`: subagent, W2.T4 map marker keyboard access.
- `09d-subagent-W4.T3-preserve-search.jsonl`: subagent, W4.T3 preserve `?q=` on "Back to all parks" (its prompt says W4.T2; it was recorded as W4.T3).
- `10-W5.T1-verification.jsonl`: W5.T1 verification pass.
- `11-parkmap-simplify-refactor.jsonl`: follow-up chat after W5.T1 that simplified `ParkMap.tsx` without changing behavior. It is not a `PLAN.md` track.
- `12-W6.T1-ai-log-export.jsonl`: W6.T1 AI log export (this index).
- `grokbot-review-parkplan.md`: a Grok chat reviewing the park.tsx, held outside Cursor, to help simplify and make code human readable

## Verification results

Checked on 2026-10-27 (W5.T1) against the Vite dev server, in Google Chrome driven by Playwright at 375×812 and 1280×800.

**Lint, tests, build.** `npm run lint && npm test && npm run build` passed before and after the fixes below: ESLint clean, 50 tests in 5 files passing, production build succeeds.

**Layouts.** At 375px the home page shows the header, search, list, and "Open map". The map opens full screen with "Show list", and focus moves between the two buttons. At 1280px the map fills the page with the list panel on the left. Detail pages use the full-bleed hero and overlapping card on a phone, and the centered rounded column on desktop. No page scrolls sideways at either width.

**Keyboard.** At both widths, keyboard only: Tab goes to search, then the first park. Enter opens it. Tab reaches "Back to all parks", and Enter returns home. Each stop had a visible blue ring. With `?q=dog`, the same round trip kept the query. On desktop, Tab from the last list item reaches the first marker (ring shown, popup opens), Tab moves to "View details", and Enter opens that park. A mouse click on a marker opens its popup once.

**Detail pages.** All 12 parks were opened at both widths and compared with `src/data/parks.json`: name, address, description, hours, acreage, rating, and stars. No crashes, no console errors. Missing data shows as allowed: Highland Dog Park has no address row and no Photos section, with a placeholder hero. Old Mill shows "No description available". Cedar Hill shows "No rating yet" and no stars. An unknown id shows "Park not found" with a link home. `src/data/parks.json` matches `assets/parks.sample.json` on every field except `images`.

**Search.** "dog" (2), "trails" (6), and "zzz" (0, with the "No parks match" state) gave the same count in the list, on the map, and in the heading, at both widths. The query stays in `?q=`.

**Fixed in this pass**
- On desktop, some searches ("restrooms", "playground") fitted a marker under the list panel. The map now fits markers into the area right of the panel (`ParkMap.tsx`).
- On mobile in development, the home page focused "Open map" on load because React StrictMode runs effects twice, so the first Tab left the page. Focus now moves only when the map is opened or closed (`HomePage.tsx`).

**Not fixed** (works as specified): "wifi" finds nothing, because search matches amenity labels as shown ("Wi-Fi"), not descriptions. "wi-fi" finds Central Plaza Green.
