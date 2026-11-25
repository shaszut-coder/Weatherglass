# Weatherglass

A personal weather journal. Log conditions by hand or pull them live, track clouds and pressure trends, watch severe weather alerts, and build a searchable history of what the sky was doing wherever you were.

**Live app:** https://weatherglass.earth/
**Current version:** v5.6.3
**Philosophy:** see [PHILOSOPHY.md](./PHILOSOPHY.md) — this is a personal weather observation journal, not a forecast app

## What it does

- **Installable & offline** — add it to your home screen (Safari → Share → Add to Home Screen; Chrome → Install) for a full-screen app that opens with no connection. Quick Log and Quick Photo Log work offline too: they save GPS, time, moon and photo right away, then fill in weather, place name, UV/PM2.5, tides and (for recent entries) alerts automatically once you're back online
- **Record** — log a reading manually, auto-fill current conditions with Quick Log, or use Quick Photo Log (camera-first — take a photo and conditions fill in automatically) for your GPS location
- **Notebooks** — link several entries together into one ongoing moment (e.g. a storm as it rolls through), rather than flattening changing conditions into a single reading. Manage them (rename, present in Speaker Mode, delete the grouping) from Settings → View All Notebooks
- **Cloud Classification** — Settings → Classify Cloud Photos scans for photos without a cloud type and lets you tag them one at a time with a guided, texture-first picker (2 taps for most types) instead of hunting through a raw dropdown. Optionally connect a self-hosted AI Worker (your own Cloudflare + Anthropic API key, see `worker/DEPLOYMENT.md`) for an AI-suggested classification instead of answering the questions yourself
- **Journal** — a color-coded month calendar by default (green/orange/red by alert severity, with a 👁 icon for personally-flagged Notable days) — tap a day to see its entries. Search replaces the calendar with the classic flat searchable list
- **Trends** — charts (temp, pressure, humidity, heat index, pressure rate-of-change, year-over-year, transect, UV, PM2.5) over 1d/7d/30d/All windows, plus computed Insights (temp/humidity correlation, personal comfort threshold, peak heat index, alert coverage), Pattern Tiles, and a Pressure Watch rapid-change indicator
- **Map** — station view or a chronological route view of everywhere you've logged, color-coded by temperature, with a month-calendar picker to jump to any date's entries
- **Gallery** — every photo in a Photos-style grid (3 across on a phone), grouped by month, with filter chips (All · Untagged · each cloud type) and small cloud-type labels on each tile. Tiles use lightweight thumbnails that load as you scroll. By Genus shows the classification collection, with "See all" per type. Plus a built-in cloud atlas reference (Cloudspotter's Guide classifications) and Goethe's cloud verses
- **Alerts** — active NWS watches/warnings for your location, logged alongside the entry
- **Moon phase & illumination**, logged automatically with each entry
- **Tides** — tide state, approximate water level, and next high/low, looked up automatically on every entry (Quick Log, Quick Photo Log, manual) within 40 km of a NOAA tide station. Settings → Backfill tides fills existing coastal entries
- **Speaker Mode** — pick a date range, get a fullscreen presentation-ready slide deck (tiles for this range and overall totals, stats, alert timeline, photos, route) for showing your data live
- **Trip Summaries** — auto-detected from GPS gaps in your log, with distance, temp range, and notable events per trip

## How it's built

Single self-contained `index.html` — no build step, no bundler, no backend. Everything (HTML, CSS, JS) lives in one file by design, so a new version is just a new `index.html`.

**Install/offline support files** (beside `index.html`, since browsers require them to be separate):
- `sw.js` — service worker. Network-first for the app page (you always get the latest deploy when online), cache-first for the CDN libraries and fonts, and keeps up to 400 recently viewed map tiles. It never caches API calls and holds no journal data. Bump its `CACHE_VERSION` when it or the files it pre-caches change
- `manifest.json` — app name, colors, and icons for installation
- `icon-192.png`, `icon-512.png` (also used as the maskable icon), `apple-touch-icon.png`, in the top level of the repo beside `index.html`. The "Dusk Weatherglass" icon (v5.6.3): a brass barometer bezel with a window onto a dusk sky, a navy needle for the current reading and a bronze set hand for the last one. The same 180 px image is also embedded in `index.html` for the header logo and home-screen icon, and `icon-192.png` doubles as the browser-tab icon

**Storage:** IndexedDB, with automatic one-time migration from an older localStorage-based version. Two stores: `entries` (the journal, which is what gets exported) and `thumbs` (gallery thumbnails, which aren't exported and rebuild themselves automatically). Nothing leaves your device except the API calls below — there's no server component and no account system.

**External data sources** (all free, no API key required):
- [Open-Meteo](https://open-meteo.com/) — current conditions and air quality (UV/PM2.5, captured on every entry including quick logs), plus historical backfill via Settings
- [api.weather.gov](https://www.weather.gov/documentation/services-web-api) (NOAA/NWS) — active weather alerts (US only)
- [Nominatim](https://nominatim.org/) (OpenStreetMap) — reverse geocoding for location names (rate-limited to 1 request/sec per their usage policy)
- [NOAA CO-OPS](https://tidesandcurrents.noaa.gov/) — tide predictions within 40 km of a tide station (station list cached per session)

**Libraries** (loaded via cdnjs):
- [Leaflet](https://leafletjs.com/) — maps
- [Chart.js](https://www.chartjs.org/) — trend charts
- [exif-js](https://github.com/exif-js/exif-js) — reading photo metadata
- [JSZip](https://stuk.github.io/jszip/) — Speaker Kit archive export

## Deployment

Hosted on **Cloudflare** (Pages/Workers), source on **GitHub**. Push `index.html` to the repo and it deploys automatically — no CI/build pipeline involved.

### Repo layout

```
index.html
sw.js
manifest.json
icon-192.png
icon-512.png
apple-touch-icon.png
README.md
CHANGELOG.md
```

### Versioning workflow

Each release is:
1. A new `index.html` (version bumped in two places: the header comment and the `APP_VERSION` constant). If `sw.js` changes too, bump its `CACHE_VERSION`
2. An updated `CHANGELOG.md` — one running file, newest entry at the top, not a per-version file
3. An updated `README.md`, kept current with whatever shipped

This keeps testing and rollback simple — reverting a bad release is just reverting `index.html`. No import/export data migration is needed between versions; the IndexedDB schema is stable and additive.

## Backup & data safety

Since everything lives in browser storage on one device, **regular exports are the only backup** — there's no cloud sync.

**On iPhone, the installed app and Safari keep separate storage.** Moving to the home-screen app means exporting from Safari and importing into the installed app (each part), then logging only from the installed app. Installed apps get protected storage (the app also requests persistent storage), so this is the safer place for the journal to live.

- **Export JSON** — full backup, everything including photos, re-importable
- **Export CSV** — for spreadsheet analysis; not re-importable
- **Speaker Kit (.zip)** — JSON + CSV + all photos as real image files + a manifest with a SHA-256 checksum, bundled in one archive
- **Import** — accepts Weatherglass JSON exports; skips entries that already exist (by id) rather than duplicating them
- A reminder banner appears in Settings if it's been 7+ days since your last export

Very large exports split automatically into multiple parts (`part1-of-N`, `part2-of-N`, …) to avoid crashing the tab; import each part separately.

## Known limitations / open items

- Single-device only — no sync between browsers or devices
- The first visit needs a connection, so the app and its libraries can be saved for offline use
- Offline entries can't recover alerts older than about 5 days, so those stay marked unknown rather than "no alert"
- Speaker Mode's route slide is a chronological list, not a live interactive map (deferred — would need a second Leaflet instance independent of the Map tab's)
- `tideState`/tide fields only populate within 40 km of a NOAA tide station; empty for inland locations, including the Great Lakes
