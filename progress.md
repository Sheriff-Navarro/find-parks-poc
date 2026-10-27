# Find a Park - Progress

Current wave: 2

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
Status: TODO
Files touched:
Notes:
Commit:

## W2.T2 UI primitives
Status: TODO
Files touched:
Notes:
Commit:

## W2.T3 Map component
Status: TODO
Files touched:
Notes:
Commit:

## W3.T1 Home page
Status: TODO
Files touched:
Notes:
Commit:

## W3.T2 Detail page
Status: TODO
Files touched:
Notes:
Commit:

## W4.T1 Search
Status: TODO
Files touched:
Notes:
Commit:

## W4.T2 README draft
Status: TODO
Files touched:
Notes:
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
