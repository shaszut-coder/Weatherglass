# Weatherglass

A personal weather journal. Log conditions by hand or pull them live, track clouds and pressure trends, watch severe weather alerts, and build a searchable history of what the sky was doing wherever you were.

**Live app:** https://weatherglass.shaszut.workers.dev/
**Current version:** v3.4.0
**Philosophy:** see [PHILOSOPHY.md](./PHILOSOPHY.md) — this is a personal weather observation journal, not a forecast app

## What it does

- **Record** — log a reading manually, auto-fill current conditions with Quick Log, or use Photo Capture (camera-first — take a photo and conditions fill in automatically) for your GPS location
- **Journal** — a searchable, filterable log of every entry, with photos
- **Trends** — charts (temp, pressure, humidity, heat index, pressure rate-of-change, year-over-year, transect, UV, PM2.5) over 1d/7d/30d/All windows, plus computed Insights (temp/humidity correlation, personal comfort threshold, peak heat index, alert coverage), Pattern Tiles, and a Pressure Watch rapid-change indicator
- **Map** — station view or a chronological route view of everywhere you've logged, color-coded by temperature
- **Gallery** — cloud photos organized by genus, with a built-in cloud atlas reference (Cloudspotter's Guide classifications)
- **Alerts** — active NWS watches/warnings for your location, logged alongside the entry
- **Moon phase & illumination**, logged automatically with each entry
- **Speaker Mode** — pick a date range, get a fullscreen presentation-ready slide deck (tiles for this range and overall totals, stats, alert timeline, photos, route) for showing your data live
- **Trip Summaries** — auto-detected from GPS gaps in your log, with distance, temp range, and notable events per trip

## How it's built

Single self-contained `index.html` — no build step, no bundler, no backend. Everything (HTML, CSS, JS) lives in one file by design, so a new version is just a new `index.html`.

**Storage:** IndexedDB, with automatic one-time migration from an older localStorage-based version. Nothing leaves your device except the API calls below — there's no server component and no account system.

**External data sources** (all free, no API key required):
- [Open-Meteo](https://open-meteo.com/) — current conditions, historical backfill (including UV/PM2.5, backfillable in bulk for existing entries via Settings), air quality
- [api.weather.gov](https://www.weather.gov/documentation/services-web-api) (NOAA/NWS) — active weather alerts (US only)
- [Nominatim](https://nominatim.org/) (OpenStreetMap) — reverse geocoding for location names (rate-limited to 1 request/sec per their usage policy)
- [NOAA CO-OPS](https://tidesandcurrents.noaa.gov/) — tide predictions, for coastal locations

**Libraries** (loaded via cdnjs):
- [Leaflet](https://leafletjs.com/) — maps
- [Chart.js](https://www.chartjs.org/) — trend charts
- [exif-js](https://github.com/exif-js/exif-js) — reading photo metadata
- [JSZip](https://stuk.github.io/jszip/) — Speaker Kit archive export

## Deployment

Hosted on **Cloudflare** (Pages/Workers), source on **GitHub**. Push `index.html` to the repo and it deploys automatically — no CI/build pipeline involved.

### Versioning workflow

Each release is:
1. A new `index.html` (version bumped in two places: the header comment and the `APP_VERSION` constant)
2. An updated `CHANGELOG.md` — one running file, newest entry at the top, not a per-version file
3. An updated `README.md`, kept current with whatever shipped

This keeps testing and rollback simple — reverting a bad release is just reverting `index.html`. No import/export data migration is needed between versions; the IndexedDB schema is stable and additive.

## Backup & data safety

Since everything lives in browser storage on one device, **regular exports are the only backup** — there's no cloud sync.

- **Export JSON** — full backup, everything including photos, re-importable
- **Export CSV** — for spreadsheet analysis; not re-importable
- **Speaker Kit (.zip)** — JSON + CSV + all photos as real image files + a manifest with a SHA-256 checksum, bundled in one archive
- **Import** — accepts Weatherglass JSON exports; skips entries that already exist (by id) rather than duplicating them
- A reminder banner appears in Settings if it's been 7+ days since your last export

Very large exports split automatically into multiple parts (`part1-of-N`, `part2-of-N`, …) to avoid crashing the tab; import each part separately.

## Known limitations / open items

- Single-device only — no sync between browsers or devices
- Not currently an installable PWA (no service worker/manifest yet) — requires a network connection to load on first visit
- Speaker Mode's route slide is a chronological list, not a live interactive map (deferred — would need a second Leaflet instance independent of the Map tab's)
- `tideState`/tide fields only populate near a NOAA tide station; empty for inland locations
