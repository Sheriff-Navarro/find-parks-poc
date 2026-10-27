# Find a Park - Progress

Current wave: 4

Status values: TODO, IN PROGRESS, DONE, COMMITTED. Each agent edits only its own block.

| Wave | Tracks | Can run concurrently |
|---|---|---|
| 1 | W1.T1 | No (alone) |
| 2 | W2.T1, W2.T2, W2.T3 | Yes |
| 3 | W3.T1, W3.T2 | Yes |
| 4 | W4.T1, W4.T2 | Yes |
| 5 | W5.T1 | No (alone) |
| 6 | W6.T1 | No (human-run, last) |

## W1.T1 Scaffold
Status: DONE
Files touched:
- package.json
- package-lock.json (created by npm install; not named in the ownership list)
- vite.config.ts
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- index.html
- eslint.config.js
- .gitignore
- src/main.tsx
- src/App.tsx
- src/index.css
- src/types/park.ts
- src/data/parks.json
- src/test/setup.ts
- src/pages/HomePage.tsx
- src/pages/ParkDetailPage.tsx
Image credits (file, author, license, URL):
- Prospect_Park_New_York_October_2015_003.jpg — King of Hearts — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Prospect_Park_New_York_October_2015_003.jpg/1280px-Prospect_Park_New_York_October_2015_003.jpg
- Riverside_Park_02.jpg — Momos — CC BY-SA 3.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Riverside_Park_02.jpg/1280px-Riverside_Park_02.jpg
- Riverside_Park_Pier_I.jpg — 南冥大鹏 — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Riverside_Park_Pier_I.jpg/1280px-Riverside_Park_Pier_I.jpg
- Bryant_Park_jeh.JPG — Jim.henderson — Public domain — https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Bryant_Park_jeh.JPG/1280px-Bryant_Park_jeh.JPG
- Brooklyn_Botanic_Garden_New_York_May_2015_panorama_2.jpg — King of Hearts — CC BY-SA 3.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Brooklyn_Botanic_Garden_New_York_May_2015_panorama_2.jpg/1280px-Brooklyn_Botanic_Garden_New_York_May_2015_panorama_2.jpg
- Bluebells_in_the_Brooklyn_Botanic_Garden_(42915p).jpg — Rhododendrites — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Bluebells_in_the_Brooklyn_Botanic_Garden_%2842915p%29.jpg/1280px-Bluebells_in_the_Brooklyn_Botanic_Garden_%2842915p%29.jpg
- Salt_Marsh_in_Gerritsen_Beach_(10813p).jpg — Rhododendrites — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Salt_Marsh_in_Gerritsen_Beach_%2810813p%29.jpg/1280px-Salt_Marsh_in_Gerritsen_Beach_%2810813p%29.jpg
- Brooklyn_Banks-_the_skatepark_that_wasn't_supposed_to_be_a_skatepark_(4264784146).jpg — zombieite — CC BY 2.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Brooklyn_Banks-_the_skatepark_that_wasn%27t_supposed_to_be_a_skatepark_%284264784146%29.jpg/1280px-Brooklyn_Banks-_the_skatepark_that_wasn%27t_supposed_to_be_a_skatepark_%284264784146%29.jpg
- Flushing_Meadows_Meadow_Lake_td_(2018-05-26)_25_-_Baseball_Field_13.jpg — Tdorante10 — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Flushing_Meadows_Meadow_Lake_td_%282018-05-26%29_25_-_Baseball_Field_13.jpg/1280px-Flushing_Meadows_Meadow_Lake_td_%282018-05-26%29_25_-_Baseball_Field_13.jpg
- Playground_2947.jpg — Chris Light — CC BY-SA 4.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Playground_2947.jpg/1280px-Playground_2947.jpg
- Congaree_Trees_-_Congaree_National_Park_-_Flickr_-_aparlette.jpg — Andrew Parlette — CC BY 2.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Congaree_Trees_-_Congaree_National_Park_-_Flickr_-_aparlette.jpg/1280px-Congaree_Trees_-_Congaree_National_Park_-_Flickr_-_aparlette.jpg (cedar-hill-nature-preserve)
- View_from_Bear_Mountain_overlooking_Hudson_River.jpg — Mwanner (Commons Artist: "The original uploader was Mwanner at English Wikipedia.") — CC BY-SA 3.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/View_from_Bear_Mountain_overlooking_Hudson_River.jpg/1280px-View_from_Bear_Mountain_overlooking_Hudson_River.jpg (east-ridge-trailhead)
- Seattle_-_fishing_on_Pier_62_&_63.jpg — Joe Mabel — CC BY-SA 3.0 — https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Seattle_-_fishing_on_Pier_62_%26_63.jpg/1280px-Seattle_-_fishing_on_Pier_62_%26_63.jpg (lakeshore-point)
Notes:
- Every thumbnail above returned HTTP 200 from `curl -sI` (User-Agent set; Wikimedia rejects a bare HEAD). Query strings were dropped. URLs use the upload.wikimedia.org 1280px thumb form.
- cedar-hill-nature-preserve: Commons search "deciduous forest boardwalk trail" returned one JPEG, the Congaree trees photo.
- east-ridge-trailhead: Commons search "ridge trail overlook New York" returned only scanned book pages, not an overlook photo. Selected the Bear Mountain / Hudson River overlook (CC BY-SA 3.0), a New York ridge overlook.
- lakeshore-point: from Commons search "fishing pier waterfront park", selected the Joe Mabel photo of people fishing on Seattle Pier 62 & 63.
- highland-dog-park images is []. No other park fields were changed. assets/parks.sample.json was left untouched.
- TypeScript is pinned to ~5.9.3. The current Vite react-ts template ships TypeScript 7.0, and typescript-eslint 8.72 only accepts TypeScript below 6.1, so a plain `npm install` could not resolve both. ESLint is required by this track's eslint.config.js.
- Routes: `/` HomePage, `/park/:id` ParkDetailPage, `*` "Page not found" with a link home. BrowserRouter is in src/main.tsx. Pages are placeholders.
- Did not run lint, test, or build, and did not commit.
Commit:

## W2.T1 Data layer
Status: DONE
Files touched:
- src/data/parks.ts
- src/data/parks.test.ts
- src/lib/format.ts
Notes:
- `normalizeParks(raw: unknown): Park[]` returns [] for non-arrays; non-object entries are treated as empty and dropped (null id). Strings are trimmed, empty becomes null; numbers must be finite (NaN, "4.4", "abc" become null); arrays keep only trimmed non-empty strings, a non-array becomes null; a non-object location becomes null. Output is sorted by name (localeCompare), null names last, so the sort lives inside normalizeParks and PARKS is just `normalizeParks(rawJson)`.
- `getParks()` returns the same module-level PARKS array every call. `getParkById(id)` accepts `string | null | undefined` (so `useParams().id` can be passed directly) and returns `Park | null`.
- `src/lib/format.ts`: `formatAcreage(n | null)` returns "526 acres" / "1 acre" / "1,200 acres" or null (callers omit the row). `formatRating(n | null)` returns "4.4 / 5" (always one decimal, so 4 is "4.0 / 5") or "No rating yet". `hasAddress(park)` is true only when location and address are non-null.
- Tests cover the three known gaps, getParks/getParkById, non-array input, an entry missing every key (dropped) and an id-only entry (all other keys null), wrong types, blank/non-string ids (dropped), trimming, array filtering, null-name sort order, and the format helpers. Tests not run per protocol.
- Follow-up: none. Duplicate ids are not de-duplicated (getParkById returns the first); the current data has none.
Commit: aa3fa5b

## W2.T2 UI primitives
Status: DONE
Files touched:
- src/components/ui/StarRating.tsx
- src/components/ui/ParkImage.tsx
- src/components/ui/Placeholder.tsx
- src/components/ui/BackLink.tsx
- src/components/ui/InfoRow.tsx
- src/components/ui/AmenityChip.tsx
- src/components/ui/joinClasses.ts
- src/lib/amenities.ts
Notes:
- Presentational only. No park JSON or getParks/getParkById imports. Optional className on each component for layout. Class strings are joined by joinClasses in src/components/ui/joinClasses.ts (drops undefined and blank parts).
- StarRating: null or non-finite rating renders nothing. Otherwise role="img" with aria-label "Rated 4.4 out of 5" (one decimal via toFixed). Filled stars use the star token; a half star is an empty Star with StarHalf over the left side. The graphic rounds to the nearest half (4.4 draws four full stars and one half). A rating of 0 still draws five empty stars.
- ParkImage: null, blank, or failed src renders Placeholder. Placeholder is role="img", aria-label "No photo available", with a Mountain icon on bg-chip. The photo and the fallback both use the caller's className plus h-full w-full; the photo also uses object-cover. A later src resets the error because the failed URL is stored, not a boolean.
- BackLink: react-router Link, default to="/" and label "Back to all parks". White (bg-surface) pill, ChevronLeft, shadow so it reads on a hero. Focus ring: focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2. It is the only interactive primitive in this track.
- InfoRow: label (text-muted) and value (text-ink). Renders nothing when value is null or blank, so a missing address or acreage omits the row. Pass formatRating's "No rating yet" through when that string should show.
- AmenityChip takes a slug and calls getAmenity. getAmenity trims and lowercases, then returns { label, icon }. Unknown slugs use MapPin and a title-cased label ("night-market" → "Night Market"). Every slug in src/data/parks.json has an entry. W4 search should match getAmenity(slug).label.
- Icon names were checked against lucide-react 1.62 in this install (Waves and Basketball are not exported; lake uses WavesHorizontal, basketball uses CircleDot).
- Did not run lint, test, or build, and did not commit. These components are not mounted; home and detail pages belong to later tracks, so they were not exercised in the browser.
- Follow-up: none.
Commit:

## W2.T3 Map component
Status: DONE
Files touched:
- src/components/map/ParkMap.tsx
- src/components/map/ParkPopup.tsx
Notes:
- `ParkMap({ parks, className? })`: OSM tiles with attribution, a white-ringed primary CircleMarker per park (radius 9), and parks with null location/lat/lng skipped. Imports `leaflet/dist/leaflet.css`. No geolocation is used.
- Bounds: a `FitToParks` child calls `fitBounds` (padding 32, maxZoom 15, so a single park doesn't zoom all the way in) and refits only when the set of coordinates changes, so a search that returns the same parks doesn't reset the view. With no mappable parks it falls back to NYC (40.7128, -74.006) at zoom 11.
- aria-label: `MapContainer` passes through only className/id/style, so the label sits on a wrapping `<div role="region" aria-label="Map of parks">`, and `className` goes on that wrapper. **W3.T1: give ParkMap a className with a height (e.g. `h-full` inside a sized parent or `h-dvh`);** the inner map is `h-full w-full`, so without a height it renders 0px tall.
- Marker color: Leaflet writes fill/stroke as SVG attributes, which can't read CSS variables, so the marker uses `className: 'fill-primary stroke-white'` (the Tailwind token wins over the attribute) with a `#1d4ed8` (blue-700) hex fallback.
- `ParkPopup({ park })`: name ("Unnamed park" if null), the address only if present, and a "View details" Link to `/park/:id` (id is URI-encoded; the link is omitted if id is null). It uses Tailwind `!` overrides because leaflet.css sets popup `p` margins and `a` color. The Link has the focus-visible ring. Popups render through react-leaflet's portal, so router context works.
- Keyboard: CircleMarkers aren't keyboard-focusable. The list (W3.T1) is the keyboard path to details, per the must-haves.
- One `eslint-disable-next-line react-hooks/exhaustive-deps` in FitToParks (the effect is keyed on the coordinate string on purpose). Did not run lint/test/build; did not commit.
Commit:

## W3.T1 Home page
Status: DONE
Files touched:
- src/pages/HomePage.tsx
- src/components/park-list/ParkList.tsx
- src/components/park-list/ParkListItem.tsx
- src/components/park-list/ParkListPanel.tsx
Notes:
- List data is `getParks()`. Each row is a router Link to `/park/:id` (id is URI-encoded, same as ParkPopup) with a ParkImage thumbnail (first image, or the placeholder when images is null or empty), the name ("Unnamed park" when null, matching ParkPopup), the address only when `hasAddress` is true, and a ChevronRight. Focus ring is `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`. Parks with null lat/lng stay in the list; ParkMap already skips them.
- Mobile (matchMedia below 48rem): header "Find a Park", scrollable list, and an "Open map" button. That button mounts a full-screen ParkMap with a "Show list" button. Opening the map moves focus to "Show list"; closing it moves focus back to "Open map". The first render does not steal focus.
- Desktop (48rem and up): full-viewport ParkMap with a floating `rounded-3xl` left panel. The list scrolls inside the panel. Leaflet zoom and attribution (`.leaflet-left`) are shifted to the right so the panel does not cover them. The map wrapper is `z-0` so Leaflet's internal z-index stays under the panel and the "Show list" button.
- The map is mounted only for the layout on screen. A `display:none` Leaflet container initializes at 0px (W2.T3 note) and would stay blank.
- Search slot: empty `<div data-slot="park-search">` in ParkListPanel, between the heading and the scrolling list, on both layouts. W4.T1 owns HomePage and ParkListPanel: filter before the parks array is passed to ParkListPanel and ParkMap, and put SearchInput in that slot. The count string "Find a Park (4 of 12)" can replace the h1 text in the panel.
- Did not run lint, test, or build, and did not commit. Did not start the dev server; the human runs the app, and W5.T1 does the 375px / 1280px check.
- Follow-up: none for this track.
Commit:

## W3.T2 Detail page
Status: DONE
Files touched:
- src/pages/ParkDetailPage.tsx
- src/pages/ParkDetailPage.test.tsx
- src/components/park-detail/ParkHero.tsx
- src/components/park-detail/ParkInfoList.tsx
- src/components/park-detail/AmenityGrid.tsx
- src/components/park-detail/PhotoGallery.tsx
Notes:
- `getParkById(useParams().id)`. Unknown id renders "Park not found" and a "Back to all parks" link to `/`. `document.title` is "{name} · Find a Park", or "Park not found · Find a Park". A null name uses "Unnamed park".
- Mobile: full-bleed hero (`h-72`), BackLink overlaid, content card `rounded-t-3xl -mt-6` with a drag-handle bar (`md:hidden`). Desktop (`md`): centered `max-w-3xl` column, hero `md:rounded-3xl`, card overlap removed (`md:mt-6`).
- Shows h1 name, address under the name when present, StarRating (omitted when rating is null), description or "No description available", info rows Address / Hours / Size / Rating (Address and Size omitted when null; Rating uses formatRating, so null is "No rating yet"), amenity grid (omitted when empty), photo gallery (omitted when `images` is null or empty). Every image goes through ParkImage, including the hero, so a failed URL shows the placeholder. The hero still renders for a park with no images (placeholder); only the Photos section is hidden.
- Address is shown twice when present: under the title and in the Details row.
- Revision (human feedback): the amenity grid uses tiles instead of chips. Each tile has the icon centered above the label on a `bg-chip rounded-xl` background, in 3 columns on mobile and 4 from `md`. The tile is built in AmenityGrid from `getAmenity`, because AmenityChip is owned by W2.T2. AmenityChip is no longer used by the detail page.
- Tests cover Highland Dog Park (no address, no `<img>`, no Photos heading, placeholder hero), Cedar Hill (no stars, "No rating yet"), Old Mill ("No description available", two gallery photos), a Prospect Park gallery image whose `error` event shows "No photo available", and an unknown id. Tests not run.
- Did not run lint, test, or build, and did not commit. Did not open the app; the human runs it, and W5.T1 is the verification pass.
- Follow-up: none.
Commit:

## W4.T1 Search
Status: DONE
Files touched:
- src/lib/filterParks.ts
- src/lib/filterParks.test.ts
- src/components/search/SearchInput.tsx
- src/pages/HomePage.tsx
- src/components/park-list/ParkListPanel.tsx
- progress.md (this block, and "Current wave" set to 4 as the wave's first track)
Notes:
- `filterParks(parks, query)`: trims and lowercases the query; an empty, blank, or null query returns the same input array. Otherwise it keeps parks whose name, address, or any amenity label (`getAmenity(slug).label`, so "Wi-Fi" and "Bike path" match, but raw slugs like "bike-path" do not) contains the query. Null fields and empty arrays are skipped. Input order is preserved.
- Tests use fixture parks for name, address, and amenity-label matching, trimming, case, no-address parks, no matches, and no mutation. They also run a few assertions on the real data. Tests not run.
- `SearchInput`: visible `<label>` "Search parks" tied by `useId`, lucide `Search` icon, `type="search"` (native WebKit cancel button hidden so only one X shows), and a "Clear search" X button (aria-label) that clears and refocuses the input. Escape also clears. Focus ring token on the input and the button. Takes `ref` as a prop (React 19).
- HomePage: the query lives in `?q=` via `useSearchParams`. Updates use `replace: true`, so typing doesn't add a history entry per keystroke. The URL is the only state, so browser Back from a detail page restores the query, and toggling the mobile map keeps it. The filtered array (memoized) goes to both ParkListPanel and ParkMap on both layouts, so markers filter too. ParkMap refits bounds when the set of matches changes.
- ParkListPanel: SearchInput fills the W3.T1 slot (inside the header, above the scroller). While filtering, the h1 reads "Find a Park (4 of 12)". An sr-only `role="status"` announces the match count. With zero matches the list area shows "No parks match", the query, and a "Clear search" button that clears and moves focus to the input.
- Follow-up (W5.T1, not owned here): the detail page's BackLink goes to `/`, so that link drops `?q=`. Browser Back keeps it. To preserve it from the pill too, ParkListItem could pass `state` and BackLink/ParkDetailPage could read it (or use `navigate(-1)`).
- Did not run lint, test, or build; did not commit.
Commit:

## W4.T2 README draft
Status: DONE
Files touched:
- README.md
Notes:
- Drafted README.md from PLAN.md, the W1.T1 image-credit list, and the implemented home/search behavior. Sections: run, what works, what was left out, key decisions, data changes, image credits (file, author, license, link), known issues, how it was checked, time spent, next steps before public use, AI conversation logs, Verification results.
- AI conversation logs explains that every chat is stored unedited in ai-logs/ and that the work followed the Wave/Track prompts in PLAN.md. The file list is a single placeholder line for W6.T1.
- Verification results is an empty heading for W5.T1.
- Time spent states the 2-hour budget. Track chats did not record start and stop times, so no measured duration is given.
- Image URLs were copied from the W1.T1 block. Did not run lint, test, or build, and did not commit.
- Follow-up: W5.T1 fills Verification results. W6.T1 replaces the ai-logs placeholder. A measured duration can be added before submission if one was kept.
Commit:

## W5.T1 Verification pass
Status: TODO
Files touched:
Lint / test / build results:
Notes:
Commit:

## W6.T1 AI log export
Status: TODO
Files in ai-logs/:
Notes:
Commit:
