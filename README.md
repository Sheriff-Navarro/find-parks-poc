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
- The public OpenStreetMap tile servers are appropriate for this exercise. A public launch needs a tile host that allows the traffic.
- Markers take a pointer click. The keyboard path to a park is the list.

## How it was checked

- Unit tests cover `normalizeParks` and the format helpers (`src/data/parks.test.ts`), the detail page with the known missing fields and a failed image (`src/pages/ParkDetailPage.test.tsx`), and `filterParks` (`src/lib/filterParks.test.ts`). The plan runs those tests once, in W5.T1, so this track did not run them.
- `npm run lint`, `npm test`, `npm run build`, and the manual pass at 375px and 1280px (keyboard only from the list to a detail page and back) belong to W5.T1. Results go in [Verification results](#verification-results).

## Time spent

The exercise is budgeted at 2 hours. The track chats did not record start and stop times, so this draft has no measured duration.

## Next steps before public use

- Finish the W5.T1 verification pass and fix what it finds.
- Host the photos, and replace the stand-ins with photos of the named parks, so the gallery has its own copy.
- Serve map tiles from a host that permits the expected traffic.
- Add an address and photos for Highland Dog Park if that listing should be complete.
- Export every project chat, unedited, into `ai-logs/` (W6.T1) before submission.

## AI conversation logs

Every chat used for this project is kept in `ai-logs/`, unedited. That includes the planning chat, each Wave/Track chat, and each commit chat. The work was split into those Wave/Track prompts. The prompts, and the files each track may edit, are in `PLAN.md`.

W6.T1 replaces the placeholder below. One line per file: the file name, and the track or step it covers.

- _(placeholder — W6.T1: file name in `ai-logs/`, and the track it covers)_

## Verification results
