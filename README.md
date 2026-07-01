# Weatherglass

A personal, browser-based weather journal. Log temperature,
pressure, wind, humidity, precipitation, sky conditions, and a
photo — plus your own notes, a "personal impression" tag, and a
"time of day" tag — all stored locally in your own browser. No
account, no server, no backend.

Current version: **2.5.0** — see `CHANGELOG.md` for details.

## What this is

A single static HTML file (`index.html`). There's no build step and
no server-side code. All your data lives in your browser's
`localStorage`, on your own device.

It uses a few external services, loaded directly in the browser:
- **Chart.js** and **Leaflet** (via cdnjs.cloudflare.com) for charts
  and the station map
- **OpenStreetMap** tiles for the map background
- **exif-js** (via cdnjs.cloudflare.com) to read photo metadata
- **Open-Meteo** (api.open-meteo.com) for live weather — free, no API
  key required
- **National Weather Service** (api.weather.gov) for active weather
  alerts — free, no API key required, **US locations only**

None of these require any account, key, or configuration on your
part. They just need the visitor's browser to have internet access.

## Deploying to Netlify

### Option A — Drag and drop (fastest, no account setup beyond signing in)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder (the one containing `index.html`,
   `netlify.toml`, etc.) onto the page
3. Netlify gives you a live URL immediately — done

This creates a site you can keep using, but updates mean dragging the
folder again each time.

### Option B — Git-based deploy (better for ongoing updates)

1. Push this folder to a GitHub (or GitLab/Bitbucket) repository
2. In Netlify: **Add new site → Import an existing project**
3. Connect your repo
4. Build settings:
   - **Build command:** leave blank (none needed)
   - **Publish directory:** `.` (the repo root, since `index.html` is
     at the top level)
5. Deploy

After this, any time you push a change to the repo, Netlify
redeploys automatically.

### Option C — Netlify CLI

```bash
npm install -g netlify-cli
cd path/to/this-folder
netlify deploy --prod
```

## A note on your data

Because everything is stored in `localStorage`, your log entries are
tied to **the specific browser and device** you used them on — they
will not appear if you open the site on a different phone, computer,
or even a different browser on the same device. Use the **Export
JSON** button in the Journal tab regularly if you want a backup, or
want to move your data to a new device (via **Import JSON** there).

## Cloud classification source

The Genus / Species / Varieties options in the Sky & Cloud
classification fields are based on the cloud classification table in
*The Cloudspotter's Guide* by Gavin Pretor-Pinney, founder of the
Cloud Appreciation Society.

Photos are embedded directly inside each entry's data (compressed,
not full resolution), so exporting/importing JSON brings photos
along automatically — no separate step needed.

### Storage

As of v2.0.0, entries are stored in **IndexedDB** rather than
`localStorage`. The old `localStorage`-based version had a hard
~5MB cap that real-world testing hit at roughly 900 entries (with
most carrying a photo) — and worse, when a save exceeded that cap,
it failed *silently*: the entry looked saved in the UI, but wasn't
actually written to disk, so it would vanish on the next reload.
IndexedDB's quota is dramatically higher (typically hundreds of MB
or more, scaling with the device's free storage) and every
save/delete/import now only updates the on-screen list *after*
storage confirms the write succeeded — so a failed write can no
longer silently diverge from what's actually persisted. If a write
ever does fail (essentially only possible if local storage is
nearly exhausted device-wide), a persistent warning banner appears
explaining exactly what happened and that nothing existing was lost.

A live **Storage: X used of Y available** indicator is shown in the
Journal tab (via the browser's `navigator.storage.estimate()` API),
turning amber past 85% usage as an early heads-up to export a
backup.

Anyone upgrading from a pre-2.0.0 version will have their existing
`localStorage` data automatically migrated into IndexedDB the first
time the new version loads — the old data is left in place
untouched as an extra safety net, just no longer used.

## Bumping the version

The version number lives in two places — keep them in sync:
- `APP_VERSION` constant near the top of the `<script>` in
  `index.html` (shown in the app's footer)
- The version comment at the very top of `index.html`

Add an entry to `CHANGELOG.md` for anything notable.
