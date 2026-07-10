# Weatherglass

A personal, privacy-first weather journal for the serious observer.
Log conditions, clouds, storms, and sky photos — all stored locally
in your browser. No account, no server, no backend, no ads.

Current version: **2.9.12** — see `CHANGELOG.md` for full history.

---

## What this is

A single static HTML file (`index.html`). No build step, no
server-side code. All data lives in your browser's **IndexedDB**,
on your own device.

Designed for enthusiasts who want a personal instrument station —
not a weather app that shows you what a server thinks the weather
is, but a log of what *you* actually observed.

---

## Features

### Recording
- **Quick Log (⚡)** — one tap captures location, current weather,
  NWS alerts, moon phase, and time of day automatically
- Full entry form: Entry Type, Category, Location name, Site Type,
  Observation Context, Time of Day, Cloud Classification, Weather
  Alerts, NOAA Tides (auto-shown for coastal site types), Air
  Quality (UV Index + PM2.5), Historical weather fill, Instruments,
  Personal Impression, Notes, Sky Photo
- **EXIF date from photo** sets entry timestamp and pre-fills
  historical weather automatically
- **Reverse geocoding** — Quick Log entries are automatically named
  by place ("Russellville, Arkansas") using OpenStreetMap

### Tabs
| Tab | Contents |
|---|---|
| **Record** | Entry form + Quick Log |
| **Journal** | Searchable entry list, On This Day strip, ⚙️ Settings |
| **Trends** | Charts, Personal Records, Insights, Pressure Watch dial, Pattern Tiles |
| **Map** | Station (clustered pins) or Route (temperature-coded path) with date filter strip |
| **Gallery** | Photo grid, My Cloud Atlas by genus, Cloud Atlas reference (Howard + Goethe), Sky Stats |

### Trends charts
TOT · POT · HOT · HIOT · HRC · YOY · ATX — plus pattern tiles for
Daily Min/Max (DMM) and Wind Rose (WDR) that tap to reveal the chart.

Time range selector: **7d / 30d / All**

Filter by: **Region** (geographic cluster) · **Location** (name) · **Site Type**

### Cloud Atlas
Based on *The Cloudspotter's Guide* by Gavin Pretor-Pinney,
incorporating Luke Howard's original 1803 classification system
(*On the Modification of Clouds*). Each genus shows:
- Howard's original notation symbol (∞ ○ — etc.)
- Fair/Foul/Changing/Unsettled weather signal
- "What Howard said" — his original forecasting text (expandable)
- Goethe's cloud verses as a coda (1817–1821, expandable)

### Map — Route mode
Plots entries chronologically as a temperature-coded path:
blue (<65°F) → green → yellow → orange → red → dark red (95°F+).
Date filter chips let you isolate a single day's travel.

### Trip Summary
Settings → Location Tools → **Generate Trip Summaries** detects
trips from GPS data (entries >50 miles from home base) and produces
a summary card per trip: dates, duration, temperature range, places
visited, alerts, storm events.

### Settings (⚙️ in Journal toolbar)
- Export JSON (multi-file, includes photos)
- Export CSV (with heat index, UV, PM2.5, tides, moon, alerts,
  site type, observation context)
- Import JSON
- Reset Storage (auto-exports backup first)
- Delete All Data (two-step confirmation + auto-export)
- Name existing locations (batch reverse geocoding, ~1/sec)
- Generate Trip Summaries

---

## External services used

All free, no API key required, no account needed:

| Service | Purpose |
|---|---|
| Open-Meteo | Current weather + air quality + historical archive |
| NOAA / NWS | Active weather alerts (US only) |
| NOAA Tides & Currents | Tide predictions (US coastal stations) |
| Nominatim / OpenStreetMap | Reverse geocoding for place names |
| Leaflet + OpenStreetMap | Interactive map |
| Chart.js | Trend charts |
| exif-js | Reading photo date/location metadata |

---

## Deployment

Deployed as a Cloudflare Worker via Git integration.

**To update:** push `index.html` to the `main` branch on GitHub.
Cloudflare detects the push and redeploys automatically — no action
needed in the Cloudflare dashboard.

**Files in this repo:**
- `index.html` — the entire app (only file that changes)
- `wrangler.jsonc` — Cloudflare Workers config (rarely changes)
- `netlify.toml` — Netlify fallback config
- `CHANGELOG.md` — version history
- `README.md` — this file

---

## Your data

All entries are stored in **IndexedDB** on your device. They are
**not** synced anywhere. They will not appear on a different browser
or device.

**Back up regularly** using Export JSON in Settings. The JSON file
includes all entries and embedded photos. Import JSON restores
everything on the same or a new device.

The live **Storage indicator** in Settings shows how much space
your entries are using and how much remains.

---

## Cloud classification source

Genus / Species / Varieties options are based on the International
Cloud Atlas classification as presented in *The Cloudspotter's Guide*
by Gavin Pretor-Pinney (Cloud Appreciation Society), cross-referenced
with Luke Howard's original 1803 essay *On the Modification of Clouds*.

---

## Version numbering

The version lives in two places in `index.html` — keep them in sync:
- The `Version:` comment at the very top of the file
- The `APP_VERSION` constant near the top of the `<script>` block

Add a `CHANGELOG.md` entry for anything notable.
