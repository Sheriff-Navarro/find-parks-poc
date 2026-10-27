# Original ask
# session: 5d83405d-2708-4ec0-baa9-97ed28809886
# pinned: 2026-10-27T12:08:48Z
# Do not rewrite. Only the human can change this.
<!-- original-ask -->
Read `.cursor/rules/find-a-park.mdc` first and follow it for this entire task. Then read `PLAN.md` and `progress.md`.
You are track W1.T1 Scaffold. Only edit files listed for W1.T1 in the PLAN.md file ownership list, plus your own block in progress.md. Mark your block IN PROGRESS now and DONE with notes when finished. Do not run lint, tests, or build. Do not commit.

Create a Vite React-TS app in the repo root (keep the existing PLAN.md, progress.md, assets/, and .cursor/). Install `tailwindcss @tailwindcss/vite react-router-dom react-leaflet leaflet lucide-react` and dev deps `@types/leaflet vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`. Configure Vitest (jsdom, `src/test/setup.ts`). Configure Tailwind v4 tokens from the rule's design system section in `src/index.css`. Add `src/types/park.ts` with every key nullable:

```ts
export type ParkLocation = { lat: number | null; lng: number | null; address: string | null };
export type Park = {
  id: string | null; name: string | null; description: string | null;
  location: ParkLocation | null; amenities: string[] | null; hours: string | null;
  images: string[] | null; acreage: number | null; rating: number | null;
};
```

Add `.gitignore` entries for node_modules and dist (keep any existing entries). Copy `assets/parks.sample.json` (leave the original untouched) to `src/data/parks.json` and replace every `images` array with the Wikimedia URLs from "Image sourcing" in PLAN.md (keep `highland-dog-park` as `[]`; change no other field). For the three rows marked "search", query the Commons API, pick a CC BY / CC BY-SA / public-domain photo, and verify each URL returns HTTP 200 with `curl -sI`. Record file name, author, license, and URL for each image in your progress.md block so W4.T2 can credit them. In `src/App.tsx` register routes `/` and `/park/:id` with a catch-all, using placeholder pages. Add npm scripts `lint`, `test`, `build`. Set "Current wave" in progress.md to 2 when done.
